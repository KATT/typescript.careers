import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.job.upsert({
    where: {
      sourceSlug_sourceKey: {
        sourceKey: 'tmp',
        sourceSlug: 'remoteok',
      },
    },
    update: {
      publishDate: new Date(),
    },
    create: {
      title: 'TypeScript Job',
      text: 'Some text',
      url: 'https//example.com',
      applyUrl: 'https//example.com',
      remote: true,
      location: 'Nowhere',
      publishDate: new Date(),
      tags: [],
      jobType: 'UNKNOWN',
      sourceKey: 'tmp',
      source: {
        connect: {
          slug: 'remoteok',
        },
      },
      company: {
        create: {
          name: 'test',
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
