import type { ZodEffects, ZodObject, ZodRawShape, z, ZodError } from 'zod';

export const parseFormData = async <T extends ZodEffects<ZodObject<ZodRawShape>>>(request: Request, schema: T): Promise<z.infer<T> | ZodError> => {
    const formData = await request.formData();
    const result = schema.safeParse(formData);

    return result.success ? result.data : result.error;
};
