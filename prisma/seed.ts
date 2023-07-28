import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const testUser = { id: '4711', name: 'John Doe' };

	await prisma.user.upsert({
		where: { id: testUser.id },
		update: {},
		create: { id: testUser.id, name: testUser.name }
	});

	const todos = [
		{ text: 'Kranplätze verdichten', done: false },
		{ text: 'Nach Wacken fahren', done: false },
		{ text: 'Chaos in Ordnung bringen', done: false },
		{ text: 'Vortrag halten', done: true },
		{ text: 'Urlaub buchen', done: false }
	];

	for (const todo of todos) {
		const { text, done } = todo;
		await prisma.todo.upsert({
			where: { text },
			update: {},
			create: { text, done, user: { connect: { id: testUser.id } } }
		});
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
