import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';

const uploadDir = 'uploads/products';

// এসিনক্রোনাসলি ফোল্ডার তৈরি করার ফাংশন
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

// সার্ভার স্টার্ট হওয়ার সময় এটি কল হবে
ensureUploadDir().catch(console.error);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ফাইলনেমকে আরও সিকিউর করতে র্যান্ডম স্ট্রিং ও টাইমস্ট্যাম্প
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // ২ মেগাবাইট লিমিট
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    const ext = path.extname(file.originalname).toLowerCase();

    if (
      allowedExtensions.includes(ext) &&
      allowedMimeTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});
