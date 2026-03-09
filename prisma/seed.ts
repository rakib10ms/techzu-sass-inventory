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
  console.log('🚀 Start seeding a full environment...');

  const hashedPass = await bcrypt.hash('password123', 10);

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPERADMIN' },
    update: {},
    create: { name: 'SUPERADMIN', description: 'System Owner' },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'BRANCH_MANAGER' },
    update: {},
    create: { name: 'BRANCH_MANAGER', description: 'Outlet Manager' },
  });

  const company = await prisma.company.upsert({
    where: { email: 'admin@rakibpos.com' },
    update: {},
    create: { name: 'Rakib Enterprise', email: 'admin@rakibpos.com' },
  });

  const outlet1 = await prisma.outlet.upsert({
    where: { receipt_prefix: 'DHK-01' },
    update: {},
    create: {
      name: 'Shop 1',
      location: 'Mirpur, Dhaka',
      phone: '01711111111',
      receipt_prefix: 'DHK-01',
      company_id: company.id,
    },
  });
  const outlet2 = await prisma.outlet.upsert({
    where: { receipt_prefix: 'CTG-01' },
    update: {},
    create: {
      name: 'Shop 2',
      location: 'Chittagonj, Dhaka',
      phone: '01711111112',
      receipt_prefix: 'CTG-01',
      company_id: company.id,
    },
  });

  // ─────────────────────────────────────────
  // 4️⃣  USERS তৈরি (রোল, কোম্পানি এবং আউটলেট আইডি এখন হাতের কাছে আছে)
  // ─────────────────────────────────────────

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@rakibpos.com' },
    update: {},
    create: {
      name: 'Rakib Super Admin',
      email: 'superadmin@rakibpos.com',
      password: hashedPass,
      company_id: company.id,
      role_id: superAdminRole.id,
      outlet_id: null, // সুপার অ্যাডমিনের কোনো আউটলেট নেই
    },
  });

  // Branch Manager
  const branchManager = await prisma.user.upsert({
    where: { email: 'manager@rakibpos.com' },
    update: {},
    create: {
      name: 'Asif Manager',
      email: 'manager@rakibpos.com',
      password: hashedPass,
      company_id: company.id,
      role_id: managerRole.id,
      outlet_id: outlet1.id, // নির্দিষ্ট আউটলেটে অ্যাসাইন করা হলো
    },
  });
  console.log('✅ Users created with roles and outlets');

  // ─────────────────────────────────────────
  // 5️⃣  CUSTOMERS তৈরি
  // ─────────────────────────────────────────
  const customer1 = await prisma.customer.upsert({
    where: {
      phone_outlet_id: { phone: '01711111111', outlet_id: outlet1.id },
    },
    update: {},
    create: {
      name: 'Md Rohan Khan',
      phone: '01711111111',
      outlet_id: outlet1.id,
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: {
      phone_outlet_id: { phone: '01711111112', outlet_id: outlet2.id },
    },
    update: {},
    create: {
      name: 'Abu Hena',
      phone: '01711111112',
      outlet_id: outlet2.id,
    },
  });
  console.log('✅ Customer created');

  // ─────────────────────────────────────────
  // 6️⃣  PRODUCTS তৈরি (Company Level)
  // ─────────────────────────────────────────
  const productsData = [
    { name: 'Coca Cola 500ml', base_price: 40 },
    { name: 'Lays Classic Chips', base_price: 30 },
    { name: 'Mineral Water 1L', base_price: 20 },
    { name: 'Dairy Milk Chocolate', base_price: 80 },
    { name: 'Basmati Rice 1kg', base_price: 150 },
  ];

  const products = [];
  for (const p of productsData) {
    const prod = await prisma.product.upsert({
      where: { name_company_id: { name: p.name, company_id: company.id } },
      update: {},
      create: { ...p, company_id: company.id },
    });
    products.push(prod);
  }
  console.log(`✅ ${products.length} Products created`);

  // ─────────────────────────────────────────
  // 7️⃣  OUTLET PRODUCTS (আউটলেটে মাল তোলা/Inventory)
  // ─────────────────────────────────────────
  const outletProds = [];
  for (const p of products) {
    const op = await prisma.outletProduct.upsert({
      where: {
        outlet_id_product_id: { outlet_id: outlet1.id, product_id: p.id },
      },
      update: {},
      create: {
        outlet_id: outlet1.id,
        product_id: p.id,
        price: Number(p.base_price) + 5,
        stock_quantity: 100,
        min_stock_level: 10,
        created_by: superAdmin.id,
      },
    });
    outletProds.push(op);
  }
  console.log('✅ Inventory updated for outlet');

  // 8️⃣  PAST SALES (সঠিক রিলেশনসহ)
  // ─────────────────────────────────────────
  if ((prisma as any).sale) {
    console.log('📊 Creating past sales...');
    for (let i = 1; i <= 3; i++) {
      const randomProduct =
        outletProds[Math.floor(Math.random() * outletProds.length)];

      await (prisma as any).sale.create({
        data: {
          outlet_id: outlet1.id,
          user_id: branchManager.id,
          customer_id: customer1.id,
          receipt_no: `RCP-OLD-00${i}`,
          total_amount: Number(randomProduct.price) * 2,
          sales_items: {
            create: [
              {
                // ✅ এখানে product_id এর বদলে outlet_product_id দিতে হবে
                // অথবা রিলেশন কানেক্ট করতে হবে
                outlet_product: { connect: { id: randomProduct.id } },
                qty: 2,
                unit_price: randomProduct.price,
                sub_total: Number(randomProduct.price) * 2,
              },
            ],
          },
        },
      });
    }
    console.log('✅ Past sales data created');
  }

  console.log('\n🎉 Full Seeding Finished Successfully!');
  console.log(`🔑 Superadmin: superadmin@rakibpos.com / password123`);
  console.log(`🔑 Manager: manager@rakibpos.com / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed!', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
