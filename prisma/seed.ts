import * as bcrypt from 'bcrypt';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@erp.com',
    },
    update: {},
    create: {
      firstName: 'ERP',
      lastName: 'Admin',
      email: 'admin@erp.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin created:', admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  