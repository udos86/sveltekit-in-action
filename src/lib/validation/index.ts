import { error } from "@sveltejs/kit";
import type { ZodEffects, ZodObject, ZodRawShape, z } from 'zod';

export const parseFormData = async <T extends ZodEffects<ZodObject<ZodRawShape>>>(request: Request, schema: T): Promise<z.infer<T>> | never => {
    const formData = await request.formData();
    const parseResult = schema.safeParse(formData);

    if (parseResult.success) {
        return parseResult.data;
    }

    throw error(400, { message: 'Invalid Form Data' });
};
