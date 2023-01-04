import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";

export const handle = SvelteKitAuth({
  providers: [
    // @ts-ignore see https://github.com/nextauthjs/next-auth/issues/6174
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })
  ]
});
