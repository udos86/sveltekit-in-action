import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { PrismaClient } from "@prisma/client";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getUser, isAuthenticated } from "$lib/auth";

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
        /*
        if (session.user !== undefined) {
          session.user.id = user.id;
        }
        */
        return session;
      }
    }
  })
);

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  const session = await event.locals.getSession();
  isAuthenticated(session);

  // get user id via extented sessin user object via session callback and propagate via custom HTTP header
  // request.headers.set('x-user-id', session!.user!.id!);

  // setting user id on locals won't work as it is not populated in endpoint
  // event.locals.userId = user?.id;

  // get user id via Prisma database lookup
  const user = await getUser(prisma, session!.user);
  request.headers.set('x-user-id', user?.id!);

  return fetch(request);
};