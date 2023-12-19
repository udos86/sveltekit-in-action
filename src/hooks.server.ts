import { sequence } from '@sveltejs/kit/hooks';
import GitHub from '@auth/core/providers/github';
import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '$lib/prisma';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

export const handle = sequence(
	SvelteKitAuth({
		trustHost: true,
		adapter: PrismaAdapter(prisma),
		session: {
			strategy: 'database',
			// see https://github.com/nextauthjs/next-auth/issues/6076
			generateSessionToken: () => crypto.randomUUID()
		},
		providers: [
			GitHub({
				clientId: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				profile(profile) {
					return {
						id: profile.id.toString(),
						name: profile.name,
						email: profile.email,
						image: profile.avatar_url
					};
				}
			})
		],
		callbacks: {
			session(params) {
				const { session, user } = params;

				if (session.user !== undefined) {
					session.user.permissions = user.permissions;
				}

				return session;
			}
		}
	})
);
