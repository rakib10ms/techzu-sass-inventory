// import { Request, Response, NextFunction } from 'express';
// import { ZodError } from 'zod';
// import { Prisma } from '@prisma/client';
// import { sendResponse, FieldError } from '../utils/apiResponse';

// export const globalErrorHandler = (
//   error: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // 🔍 ডিবাগিং: এরর অবজেক্টটি টার্মিনালে দেখা যাবে
//   console.error('❌ Error Caught in Global Handler:', error);

//   let statusCode = 500;
//   let message = 'Internal server error';
//   let errors: FieldError[] | null = null;

//   // 1️⃣ Zod Validation Error (ইনপুট ডাটা ভুল হলে)
//   if (error instanceof ZodError) {
//     statusCode = 400;
//     message = 'Validation failed';
//     errors = error.issues.map((issue) => ({
//       field: issue.path[issue.path.length - 1]?.toString() ?? 'unknown',
//       message: issue.message,
//     }));
//   }

//   // 2️⃣ Prisma Known Request Errors (যেমন: Unique Constraint, Not Found)
//   else if (error instanceof Prisma.PrismaClientKnownRequestError) {
//     message = 'Database validation failed';

//     switch (error.code) {
//       case 'P2002': // Unique constraint failed
//         statusCode = 400;

//         // ✅ আরও নিখুঁত ফিল্ড এক্সট্রাকশন
//         let fieldName = 'field';

//         if (error.meta && Array.isArray(error.meta.target)) {
//           fieldName = error.meta.target[target.length - 1];
//         } else if (
//           error.message &&
//           error.message.includes('fields: (`email`)')
//         ) {
//           // যদি মেটা ডাটা না পাওয়া যায়, মেসেজ থেকে চেনা
//           fieldName = 'email';
//         }

//         errors = [
//           {
//             field: fieldName,
//             message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} already exists.`,
//           },
//         ];
//         break;

//       case 'P2025': // Record not found
//         statusCode = 404;
//         message = (error.meta?.cause as string) || 'Record not found';
//         errors = [
//           { field: 'id', message: 'The requested record does not exist.' },
//         ];
//         break;

//       case 'P2003': // Foreign key constraint failed
//         statusCode = 400;
//         message = 'Invalid reference';
//         errors = [
//           {
//             field: 'database',
//             message: 'Related record not found (Foreign key failed).',
//           },
//         ];
//         break;

//       default:
//         errors = [
//           { field: 'database', message: `Database error code: ${error.code}` },
//         ];
//         break;
//     }
//   }

//   // 3️⃣ Prisma Validation Error (ভুল টাইপের ডাটা ডাটাবেজে পাঠালে)
//   else if (error instanceof Prisma.PrismaClientValidationError) {
//     statusCode = 400;
//     message = 'Invalid data type sent to database';
//     errors = [{ field: 'schema', message: 'Schema validation failed' }];
//   }

//   // 4️⃣ Generic Error (অন্যান্য সাধারণ এরর)
//   else if (error instanceof Error) {
//     message = error.message;
//   }

//   // ফাইনাল রেসপন্স পাঠানো
//   sendResponse(res, {
//     statusCode,
//     success: false,
//     message,
//     errors,
//   });
// };

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { sendResponse, FieldError } from '../utils/apiResponse';

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error Caught in Global Handler:', error);

  let statusCode = 500;
  let message = 'Internal server error';
  let errors: FieldError[] | null = null;

  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = error.issues.map((issue) => ({
      field: issue.path[issue.path.length - 1]?.toString() ?? 'unknown',
      message: issue.message,
    }));
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    message = 'Database validation failed';

    switch (error.code) {
      case 'P2002': {
        statusCode = 409;

        // ✅ FIX: handle both array and string formats
        const rawTarget = error.meta?.target;
        let targets: string[] = [];

        if (Array.isArray(rawTarget)) {
          // Old Prisma: ["name", "company_id"]
          targets = rawTarget as string[];
        } else if (typeof rawTarget === 'string') {
          // New Prisma: "products_name_company_id_key" (constraint name)
          // Parse field names out of the constraint string
          // Convention: tablename_field1_field2_key → split and drop first and last
          const parts = rawTarget.split('_');
          // Remove last element ("key") and first element (table name)
          targets = parts.slice(1, parts.length - 1);
        }

        // Fallback: check error message for known fields
        let fieldName = 'field';
        if (targets.length > 0) {
          // Prefer 'name' or 'email' if present, otherwise use first meaningful field
          const preferredFields = ['name', 'email', 'phone', 'slug', 'code'];
          const preferred = preferredFields.find((f) => targets.includes(f));
          fieldName = preferred ?? targets[0];
        } else if (error.message?.includes('email')) {
          fieldName = 'email';
        } else if (error.message?.includes('name')) {
          fieldName = 'name';
        }

        errors = [
          {
            field: fieldName,
            message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} already exists.`,
          },
        ];
        break;
      }

      case 'P2025':
        statusCode = 404;
        message = (error.meta?.cause as string) || 'Record not found';
        errors = [
          { field: 'id', message: 'The requested record does not exist.' },
        ];
        break;

      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference';
        errors = [
          {
            field: 'database',
            message: 'Related record not found (Foreign key failed).',
          },
        ];
        break;

      default:
        errors = [
          { field: 'database', message: `Database error code: ${error.code}` },
        ];
        break;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  sendResponse(res, {
    statusCode,
    success: false,
    message,
    errors,
  });
};
