import { error } from "@sveltejs/kit";
import type { Session } from "@auth/core/types";

export const isAuthenticated = (session: Session | null): void | never => {
    if (session === null || session.user === undefined) {
        throw error(401, { message: 'You are not logged in.' });
    }
};
