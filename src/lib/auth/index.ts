import { error } from "@sveltejs/kit";
import type { Session } from "@auth/core/types";
import type { Permission } from "@prisma/client";

export const isAuthenticated = async (locals: App.Locals): Promise<Session & { user: { email: string } }> | never => {
  const session = await locals.getSession();

  if (session === null || session.user === undefined || session.user.email === null) {
    throw error(401, { message: 'You are not logged in.' });
  }

  return session as Session & { user: { email: string } };
};

export const isAuthorized = (session: Session, permission: Permission): boolean | never => {
  if (Array.isArray(session.user?.permissions) && session.user?.permissions.includes(permission)) {
    return true;
  }

  throw error(403, { message: 'You do not have the permission.' });
};
