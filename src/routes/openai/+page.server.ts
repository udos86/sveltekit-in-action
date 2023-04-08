import { OpenAI } from "langchain/llms";
import { hasPermission, isAuthenticated } from "$lib/auth";
import { Permission } from "@prisma/client";
import type { Actions } from "@sveltejs/kit";

const model = new OpenAI();

export const actions: Actions = {
    ask: async ({ locals, request }) => {
        const session = await isAuthenticated(locals);

        if (hasPermission(session, Permission.OPENAI)) {
            // const formData = await request.formData();
            // const answer = await model.call(formData.get('prompt') as string);
            const answer = "\n\nThe most famous event that took place in 1547 was the Battle of Mühlberg, a decisive victory of the forces of the Holy Roman Emperor Charles V over those of the Protestant Schmalkaldic League. It marked the beginning of the Counter-Reformation in Germany and the end of the Schmalkaldic War."

            return { data: answer };

        } else {
            return { data: 'You are not allowed to use OpenAI' };
        }
    }
};