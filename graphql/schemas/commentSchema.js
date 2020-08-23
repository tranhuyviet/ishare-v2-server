import * as Yup from 'yup';
const comment = Yup.string().min(1).required('Comment cannot be empty!');

export const commentSchema = Yup.object({
    comment,
});
