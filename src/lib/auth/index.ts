import { error } from "@sveltejs/kit";
import type { Session } from "@auth/core/types";

export const isAuthenticated = async (locals: App.Locals): Promise<Session & { user: { email: string } }> | never => {
  const session = await locals.getSession();

  if (session === null || session.user === undefined || session.user.email === null) {
    throw error(401, { message: 'You are not logged in.' });
  }

  return session as Session & { user: { email: string } };
};
