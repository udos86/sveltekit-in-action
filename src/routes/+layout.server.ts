import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  if (session === null) {
    return { session: null };
  }

  // We don't want to expose user id to client
  const { expires } = session;
  const { name, email, image } = session.user!;
  return {
    session: { user: { name, email, image }, expires }
  }
};
