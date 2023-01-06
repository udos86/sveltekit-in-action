import { DefaultSession } from '@auth/core/types';
// see https://stackoverflow.com/questions/69602694/how-to-update-the-type-of-session-in-session-callback-in-next-auth-when-using-ty
declare module '@auth/core/types' {
	interface Session {
		user?: {
			id?: string;
		} & DefaultSession['user'];
	}
}