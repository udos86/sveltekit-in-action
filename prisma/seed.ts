import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const data = [
    { "text": "Kranplätze verdichten", "done": false },
    { "text": "Nach Wacken fahren", "done": false },
    { "text": "Chaos in Ordnung bringen", "done": false },
    { "text": "Vortrag halten", "done": true },
    { "text": "Urlaub buchen", "done": false }
  ];

  for (const item of data) {
    const { text, done } = item;
    const todo = await prisma.todo.upsert({
      where: { text },
      update: {},
      create: { text, done }
    });
    console.log(todo);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });