import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = (async (event) => {
  const session = await event.locals.getSession();
  return { session, random: Math.floor(Math.random() * 100) };
});
