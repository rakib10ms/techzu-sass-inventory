import { z } from 'zod';

// Create Schema
export const CreateCompanySchema = z.object({
  name: z.string().min(2, "Name is too short").optional().nullable(),
  email: z.string().email("Invalid email address"),
  logo_url: z.string().url("Invalid URL").optional().nullable(),
});

/**
 * Update Schema
 * .partial() ব্যবহার করার ফলে name, email, logo_url সব এখন ঐচ্ছিক (optional) হয়ে যাবে।
 * অর্থাৎ আপডেট করার সময় ইউজার চাইলে শুধু নাম, বা শুধু ইমেইল পাঠাতে পারবে।
 */
export const UpdateCompanySchema = CreateCompanySchema.partial();