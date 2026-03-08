import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL is not defined in .env file');

const pool = new pg.Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Start seeding...');

  // ─────────────────────────────────────────
  // 1️⃣  COMPANY
  // ─────────────────────────────────────────
  const company = await prisma.company.upsert({
    where: { email: 'admin@rakibpos.com' },
    update: {},
    create: {
      name: 'Rakib Software Solutions',
      email: 'admin@rakibpos.com',
    },
  });
  console.log(`✅ Company: ${company.name} (ID: ${company.id})`);

  // ─────────────────────────────────────────
  // 2️⃣  OUTLET
  // ─────────────────────────────────────────
  const outlet = await prisma.outlet.upsert({
    where: { receipt_prefix: 'DHK-01' },
    update: {},
    create: {
      name: 'Dhaka Main Branch',
      location: 'Mirpur, Dhaka',
      phone: '01711111111',
      receipt_prefix: 'DHK-01',
      company_id: company.id,
    },
  });
  console.log(`✅ Outlet: ${outlet.name} (ID: ${outlet.id})`);

  // ─────────────────────────────────────────
  // 3️⃣  USER (hashed password)
  // ─────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'rakib@rakibpos.com' },
    update: {},
    create: {
      name: 'Rakib Admin',
      email: 'rakib@rakibpos.com',
      password: hashedPassword,
      //   role: 'ADMIN',         // তোমার User model-এ role field থাকলে
      company_id: company.id,
    },
  });
  console.log(`✅ User: ${user.name} (ID: ${user.id})`);

  // ─────────────────────────────────────────
  // 4️⃣  CUSTOMER
  // ─────────────────────────────────────────
  const customer = await prisma.customer.upsert({
    where: {
      phone_outlet_id: {
        // ✅ compound unique key
        phone: '01911111111',
        outlet_id: outlet.id,
      },
    },
    update: {},
    create: {
      name: 'Walk-in Customer',
      phone: '01911111111',
      outlet_id: outlet.id,
    },
  });
  console.log(`✅ Customer: ${customer.name} (ID: ${customer.id})`);

  // ─────────────────────────────────────────
  // 5️⃣  PRODUCTS (3টি)
  // ─────────────────────────────────────────
  const product1 = await prisma.product.upsert({
    where: {
      name_company_id: { name: 'Coca Cola 500ml', company_id: company.id },
    },
    update: {},
    create: {
      name: 'Coca Cola 500ml',
      details: 'Cold drink 500ml bottle',
      base_price: 40.0,
      company_id: company.id,
    },
  });

  const product2 = await prisma.product.upsert({
    where: {
      name_company_id: { name: 'Lays Classic Chips', company_id: company.id },
    },
    update: {},
    create: {
      name: 'Lays Classic Chips',
      details: 'Classic salted potato chips 100g',
      base_price: 30.0,
      company_id: company.id,
    },
  });

  const product3 = await prisma.product.upsert({
    where: {
      name_company_id: { name: 'Mineral Water 1L', company_id: company.id },
    },
    update: {},
    create: {
      name: 'Mineral Water 1L',
      details: 'Pure mineral water 1 liter',
      base_price: 20.0,
      company_id: company.id,
    },
  });

  console.log(
    `✅ Products created: ${product1.name}, ${product2.name}, ${product3.name}`
  );

  // ─────────────────────────────────────────
  // 6️⃣  OUTLET PRODUCTS (stock সহ)
  // ─────────────────────────────────────────
  const outletProductsData = [
    {
      outlet_id: outlet.id,
      product_id: product1.id,
      price: 45.0,
      stock_quantity: 500,
      min_stock_level: 50,
      created_by: user.id,
    },
    {
      outlet_id: outlet.id,
      product_id: product2.id,
      price: 35.0,
      stock_quantity: 300,
      min_stock_level: 30,
      created_by: user.id,
    },
    {
      outlet_id: outlet.id,
      product_id: product3.id,
      price: 25.0,
      stock_quantity: 1000,
      min_stock_level: 100,
      created_by: user.id,
    },
  ];

  for (const op of outletProductsData) {
    await prisma.outletProduct.upsert({
      where: {
        outlet_id_product_id: {
          outlet_id: op.outlet_id,
          product_id: op.product_id,
        },
      },
      update: {},
      create: op,
    });
  }
  console.log(`✅ Outlet products created with stock`);

  // ─────────────────────────────────────────
  // 7️⃣  SALE (একটা sample sale)
  // ─────────────────────────────────────────
  // ✅ prisma.sale exist করে কিনা check (migration না হলে skip)
  if (!(prisma as any).sale) {
    console.log(
      '⚠️  Sale model not found — run migration first, then seed again'
    );
  } else {
    const existingSale = await (prisma as any).sale.findFirst({
      where: { outlet_id: outlet.id },
    });

    if (!existingSale) {
      const saleItems = [
        { product_id: product1.id, qty: 2, unit_price: 45.0, sub_total: 90.0 },
        { product_id: product2.id, qty: 3, unit_price: 35.0, sub_total: 105.0 },
      ];

      const total_amount = saleItems.reduce((sum, i) => sum + i.sub_total, 0);

      await (prisma as any).sale.create({
        data: {
          outlet_id: outlet.id,
          user_id: user.id,
          customer_id: customer.id,
          receipt_no: 'RCP-SEED-000001',
          total_amount,
          sales_items: {
            create: saleItems,
          },
        },
      });

      // stock deduct for seed sale
      await prisma.outletProduct.updateMany({
        where: { outlet_id: outlet.id, product_id: product1.id },
        data: { stock_quantity: { decrement: 2 } },
      });
      await prisma.outletProduct.updateMany({
        where: { outlet_id: outlet.id, product_id: product2.id },
        data: { stock_quantity: { decrement: 3 } },
      });

      console.log('✅ Sample sale created with receipt: RCP-SEED-000001');
    } else {
      console.log('⏭️  Sale already exists, skipping');
    }
  }

  console.log('\n🎉 Seeding finished successfully!');
  console.log('─────────────────────────────────────');
  console.log(`🏢 Company ID : ${company.id}`);
  console.log(`🏪 Outlet ID  : ${outlet.id}`);
  console.log(`👤 User ID    : ${user.id}`);
  console.log(`👥 Customer ID: ${customer.id}`);
  console.log(`📦 Products   : ${product1.id}, ${product2.id}, ${product3.id}`);
  console.log('─────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed!', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
