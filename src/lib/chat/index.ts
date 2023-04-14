import type { MessageAuthor } from "@prisma/client";

export interface Message {
    id: string;
    message: string;
    author: MessageAuthor;
}
