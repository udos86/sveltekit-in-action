import { zfd } from 'zod-form-data';

export const chatMessageFormData = zfd.formData({
    chatId: zfd.text(),
    message: zfd.text()
});

export const chatEditNameFormData = zfd.formData({
    chatId: zfd.text(),
    name: zfd.text()
});

export const chatDeleteFormData = zfd.formData({
    chatId: zfd.text()
});
