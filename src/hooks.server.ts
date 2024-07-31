import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from '@auth/core/providers/github';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { prisma } from '$lib/prisma';

export const { handle, signIn, signOut } = SvelteKitAuth({
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
			async session(params) {
				const { session, user } = params;

				if (session.user !== undefined && params) {
					session.user.permissions = user.permissions;
				}

				return session;
			}
		}
	});
