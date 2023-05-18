import { zfd } from 'zod-form-data';

export const addChatMessageFormData = zfd.formData({
    chatId: zfd.text(),
    message: zfd.text(),
    //lastHumanMessage: zfd.text().optional(),
    //lastAiMessage: zfd.text().optional()
});

export const editChatNameFormData = zfd.formData({
    chatId: zfd.text(),
    name: zfd.text()
});

export const deleteChatFormData = zfd.formData({
    chatId: zfd.text()
});
