import { error } from "@sveltejs/kit";
import type { DefaultSession, Session } from "@auth/core/types";
import type { Prisma, PrismaClient, User } from "@prisma/client";
import type { AdapterUser } from "@auth/core/adapters";

export const isAuthenticated = (session: Session | null): void | never => {
    if (session === null || session.user === undefined || session.user.email === null) {
        throw error(401, { message: 'You are not logged in.' });
    }
};

export const getUser = async (prisma: PrismaClient, user: DefaultSession['user']): Promise<User | null> => {
    const where: Prisma.UserWhereUniqueInput = {
        email: user?.email ?? undefined
    };

    return await prisma.user.findUnique({ where });
}

// see https://stackoverflow.com/questions/69068495/how-to-get-the-provider-access-token-in-next-auth
export const getProviderAccessToken = async (prisma: PrismaClient, user: User | AdapterUser): Promise<string | null> => {
    const account = await prisma.account.findFirst({
        where: { userId: user.id }
    });

    return account === null ? null : account.access_token;
}