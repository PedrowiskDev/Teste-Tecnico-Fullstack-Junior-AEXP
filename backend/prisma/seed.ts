import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.inscription.deleteMany();
  await prisma.event.deleteMany();

  const event1 = await prisma.event.create({
    data: {
      title: "Churrasco da Galera",
      description:
        "Vamos fazer aquele churrasco tradicional! Traga sua bebida e bom humor. Carne por nossa conta!",
      status: "ABERTO",
      capacity: 25,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Pelada de Sexta",
      description:
        "Futebol toda sexta às 19h no campo do bairro. Venha jogar e se divertir com os amigos!",
      status: "ABERTO",
      capacity: 22,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: "Aniversário da Maria",
      description:
        "Festa de aniversário da Maria com muito bolo, refrigerante e música boa. Todos estão convidados!",
      status: "ABERTO",
      capacity: 40,
    },
  });

  const event4 = await prisma.event.create({
    data: {
      title: "Happy Hour do Trabalho",
      description:
        "Vamos descontrair depois de mais uma semana corrida. Boteco da esquina, 18h!",
      status: "ABERTO",
      capacity: 15,
    },
  });

  const event5 = await prisma.event.create({
    data: {
      title: "Pizza e Netflix",
      description:
        "Noite de pizza, filmes e séries na casa do João. Tragam sugestões de filmes!",
      status: "ABERTO",
      capacity: 12,
    },
  });

  const formatPhone = (phone: string) => `+55${phone}`;

  const churrascoInscriptions = [
    { name: "Carlos Silva", phone: "11987654321" },
    { name: "Ana Santos", phone: "11976543210" },
    { name: "Pedro Oliveira", phone: "11965432109" },
    { name: "Julia Costa", phone: "11954321098" },
    { name: "Rafael Lima", phone: "11943210987" },
    { name: "Mariana Souza", phone: "11932109876" },
    { name: "Bruno Alves", phone: "11921098765" },
    { name: "Camila Rocha", phone: "11910987654" },
  ];

  for (const inscription of churrascoInscriptions) {
    await prisma.inscription.create({
      data: {
        ...inscription,
        phone: formatPhone(inscription.phone),
        eventId: event1.id,
      },
    });
  }

  const futebolInscriptions = [
    { name: "Diego Martins", phone: "11999888777" },
    { name: "Lucas Ferreira", phone: "11988777666" },
    { name: "Gabriel Nunes", phone: "11977666555" },
    { name: "Thiago Barbosa", phone: "11966555444" },
    { name: "Felipe Castro", phone: "11955444333" },
    { name: "Eduardo Ramos", phone: "11944333222" },
    { name: "Rodrigo Teixeira", phone: "11933222111" },
    { name: "Leonardo Dias", phone: "11922111000" },
    { name: "Gustavo Moreira", phone: "11911000999" },
    { name: "André Carvalho", phone: "11900999888" },
    { name: "Vinicius Pereira", phone: "11899888777" },
    { name: "Matheus Ribeiro", phone: "11888777666" },
  ];

  for (const inscription of futebolInscriptions) {
    await prisma.inscription.create({
      data: {
        ...inscription,
        phone: formatPhone(inscription.phone),
        eventId: event2.id,
      },
    });
  }

  const aniversarioInscriptions = [
    { name: "Fernanda Lima", phone: "11777666555" },
    { name: "Patricia Gomes", phone: "11766555444" },
    { name: "Amanda Silva", phone: "11755444333" },
    { name: "Bruna Santos", phone: "11744333222" },
    { name: "Daniela Costa", phone: "11733222111" },
    { name: "Renata Oliveira", phone: "11722111000" },
    { name: "Juliana Almeida", phone: "11711000999" },
    { name: "Carolina Mendes", phone: "11700999888" },
    { name: "Larissa Cardoso", phone: "11699888777" },
    { name: "Natália Freitas", phone: "11688777666" },
    { name: "Isabela Correia", phone: "11677666555" },
    { name: "Priscila Monteiro", phone: "11666555444" },
    { name: "Vanessa Campos", phone: "11655444333" },
    { name: "Monica Araujo", phone: "11644333222" },
    { name: "Claudia Batista", phone: "11633222111" },
  ];

  for (const inscription of aniversarioInscriptions) {
    await prisma.inscription.create({
      data: {
        ...inscription,
        phone: formatPhone(inscription.phone),
        eventId: event3.id,
      },
    });
  }

  const happyHourInscriptions = [
    { name: "Roberto Machado", phone: "11622111000" },
    { name: "José Miranda", phone: "11611000999" },
    { name: "Antonio Nascimento", phone: "11600999888" },
    { name: "Francisco Moura", phone: "11599888777" },
    { name: "Marcelo Vieira", phone: "11588777666" },
    { name: "Paulo Lopes", phone: "11577666555" },
  ];

  for (const inscription of happyHourInscriptions) {
    await prisma.inscription.create({
      data: {
        ...inscription,
        phone: formatPhone(inscription.phone),
        eventId: event4.id,
      },
    });
  }

  const pizzaInscriptions = [
    { name: "Beatriz Cunha", phone: "11566555444" },
    { name: "Leticia Fonseca", phone: "11555444333" },
    { name: "Aline Pinto", phone: "11544333222" },
    { name: "Sabrina Duarte", phone: "11533222111" },
  ];

  for (const inscription of pizzaInscriptions) {
    await prisma.inscription.create({
      data: {
        ...inscription,
        phone: formatPhone(inscription.phone),
        eventId: event5.id,
      },
    });
  }

  console.log("Seed completado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
