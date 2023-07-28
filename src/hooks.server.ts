import { sequence } from '@sveltejs/kit/hooks';
import GitHub from '@auth/core/providers/github';
import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '$lib/prisma';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import type { Session, User } from '@auth/core/types';
import type { Adapter } from '@auth/core/adapters';

export const handle = sequence(
	SvelteKitAuth({
		trustHost: true,
		// Typings error workaround
		// see https://github.com/nextauthjs/next-auth/issues/6106
		adapter: PrismaAdapter(prisma) as Adapter,
		session: {
			strategy: 'database',
			// see https://github.com/nextauthjs/next-auth/issues/6076
			generateSessionToken: () => crypto.randomUUID()
		},
		providers: [
			// @ts-ignore
			// see https://github.com/nextauthjs/next-auth/issues/6174
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
				// Typings error workaround
				// see https://github.com/nextauthjs/next-auth/issues/7132
				const session: Session = params.session;
				const user: User = params.user;

				if (session.user !== undefined) {
					session.user.permissions = user.permissions;
				}

				return session;
			}
		}
	})
);
