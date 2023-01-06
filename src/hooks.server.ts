import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { PrismaClient } from "@prisma/client";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { User } from "@auth/core/types";
import type { AdapterUser } from "@auth/core/adapters";
import { isAuthenticated } from "$lib/auth";

const prisma = new PrismaClient();

const authGuard: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.includes('/todos')) {
    const session = await event.locals.getSession();
    if (session?.user === undefined) {
      throw redirect(307, '/auth/signin');
    }
  }

  return await resolve(event);
}

// see https://stackoverflow.com/questions/69068495/how-to-get-the-provider-access-token-in-next-auth
const getProviderAccessToken = async (user: User | AdapterUser): Promise<string | null> => {
  const account = await prisma.account.findFirst({
    where: { userId: user.id }
  });

  return account === null ? null : account.access_token;
}

export const handle = sequence(
  SvelteKitAuth({
    // @ts-ignore
    adapter: PrismaAdapter(prisma),
    session: {
      strategy: 'database',
      // see https://github.com/nextauthjs/next-auth/issues/6076
      generateSessionToken: () => {
        return crypto.randomUUID();
      }
    },
    providers: [
      // @ts-ignore see https://github.com/nextauthjs/next-auth/issues/6174
      GitHub({
        clientId: GITHUB_ID,
        clientSecret: GITHUB_SECRET,
        profile(profile) {
          return {
            id: profile.id.toString(),
            name: profile.name,
            email: profile.email,
            image: profile.avatar_url,
          }
        }
      })
    ],
    callbacks: {
      async session({ session, user }) {
        if (session.user !== undefined) {
          session.user.id = user.id;
        }
        return session;
      }
    }
  })
);

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  const session = await event.locals.getSession();
  isAuthenticated(session);

  request.headers.set('custom-user-id', session!.user!.id!);

  return fetch(request);
};