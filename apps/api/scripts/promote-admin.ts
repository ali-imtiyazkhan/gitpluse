import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const email = process.argv[2];

async function main() {
  if (!email) {
    console.error('❌ Error: Please provide an email address.');
    console.log('Usage: npx tsx scripts/promote-admin.ts <email>');
    process.exit(1);
  }

  console.log(`🚀 Promoting ${email} to OWNER...`);

  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        role: 'OWNER',
        status: 'APPROVED',
      },
    });

    console.log('✅ Success! User promoted to Admin (OWNER).');
    console.log(`User ID: ${user.id}`);
    console.log(`Name: ${user.firstName}`);
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.error(`❌ Error: User with email "${email}" not found.`);
    } else {
      console.error('❌ Error promoting user:', error.message);
    }
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
