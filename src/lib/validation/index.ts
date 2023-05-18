import { error } from "@sveltejs/kit";
import type { ZodEffects, ZodObject, ZodRawShape, z } from 'zod';

export const parseFormData = async <T extends ZodEffects<ZodObject<ZodRawShape>>>(request: Request, schema: T): Promise<z.infer<T>> | never => {
    const formData = await request.formData();
    const result = schema.safeParse(formData);

    if (result.success) {
        return result.data;
    }

    throw error(400, { message: 'Invalid Form Data' });
};
