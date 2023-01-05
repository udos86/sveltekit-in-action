import { error } from "@sveltejs/kit";
import type { Session } from "@auth/core/types";

type ParentDataFn = () => Promise<{
    session: Session | null;
}>;

export const isAuthenticated = async (parent: ParentDataFn) => {
    const { session } = await parent();
    if (session?.user === undefined) {
        throw error(401, { message: 'You are not logged in.' });
    }
}
