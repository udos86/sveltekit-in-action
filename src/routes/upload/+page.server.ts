import { isAuthenticated } from '$lib/auth';
import { Buffer } from 'node:buffer';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	upload: async ({ locals, request }) => {
		await isAuthenticated(locals);

		const formData = await request.formData();
		const blob = formData.get('file') as Blob;
		const stream = blob.stream();

		/*
    const result = await stream.getReader().read();
    const text = new TextDecoder().decode(result.value);
    */

		let text = '';

		//@ts-expect-error
		// ReadableStream is not typed as async iterable in Node.js
		// see https://github.com/microsoft/TypeScript/issues/39051
		for await (const chunk of stream) {
			const buffer = Buffer.from(chunk);
			text = text + buffer.toString();
		}

		return { result: text };
	}
};
