import { error } from '@sveltejs/kit';
import type { Session } from '@auth/core/types';
import type { Permission } from '@prisma/client';

export type AuthenticatedSession = Session & { user: { email: string } };

export const isAuthenticated = async (locals: App.Locals): Promise<AuthenticatedSession> | never => {
	const session = await locals.auth();

	if (session === null || session.user === undefined || session.user.email === null) {
		error(401, { message: 'You are not logged in.' });
	}

	return session as AuthenticatedSession;
};

export const isAuthorized = (session: Session, permission: Permission): boolean | never => {
	if (Array.isArray(session.user?.permissions) && session.user?.permissions.includes(permission)) {
		return true;
	}

	error(403, { message: 'You do not have the permission.' });
};
