import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

const pool = new pg.Pool({ connectionString: dbUrl });

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected successfully via Prisma Adapter!');
  } catch (error: any) {
    console.error('❌ Database connection failed!');
    console.error('Reason:', error.message);
  }
}

testDbConnection();