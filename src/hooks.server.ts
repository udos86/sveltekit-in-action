import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { sequence } from "@sveltejs/kit/hooks";
import { redirect, type Handle } from "@sveltejs/kit";

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
  })
);
