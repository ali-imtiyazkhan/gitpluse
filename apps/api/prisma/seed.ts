import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      firstName: 'Test User',
      authMethod: 'credentials',
      role: 'OWNER',
      status: 'APPROVED',
    },
  });
  console.log('✅ Created test user:', testUser.email);

  // Create another test user
  const contributorUser = await prisma.user.upsert({
    where: { email: 'contributor@example.com' },
    update: {},
    create: {
      email: 'contributor@example.com',
      firstName: 'Contributor User',
      authMethod: 'credentials',
      role: 'CONTRIBUTOR',
      status: 'APPROVED',
    },
  });
  console.log('✅ Created contributor user:', contributorUser.email);

  // Create a sample project
  const project = await prisma.project.create({
    data: {
      name: 'Sample Open Source Project',
      description: 'A project to test the platform features.',
      ownerId: testUser.id,
      repoUrl: 'https://github.com/example/sample-project',
    },
  });
  console.log('✅ Created sample project:', project.name);

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Fix UI Bug',
        description: 'Fix the layout issue on the dashboard.',
        projectId: project.id,
        status: 'TODO',
        priority: 'HIGH',
      },
      {
        title: 'Implement Auth',
        description: 'Add credentials login support.',
        projectId: project.id,
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
      },
    ],
  });
  console.log('✅ Created sample tasks');

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
