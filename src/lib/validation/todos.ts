import { zfd } from 'zod-form-data';

export const addTodoFormData = zfd.formData({
    text: zfd.text(),
    done: zfd.checkbox()
});

export const editTodoFormData = zfd.formData({
    todoId: zfd.text(),
    text: zfd.text(),
    done: zfd.checkbox()
});
