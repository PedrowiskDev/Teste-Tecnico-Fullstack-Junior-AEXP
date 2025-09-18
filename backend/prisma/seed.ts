import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create 3 events
  const event1 = await prisma.event.create({
    data: {
      title: "Workshop de TypeScript",
      description: "Aprenda TypeScript do zero ao avançado",
      status: "ABERTO",
      capacity: 30,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Palestra sobre Docker",
      description: "Containerização para iniciantes",
      status: "ENCERRADO",
      capacity: 50,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: "Node.js na Prática",
      description: "Desenvolvimento backend com Node.js",
      status: "ABERTO",
      capacity: 25,
    },
  });

  console.log({ event1, event2, event3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
