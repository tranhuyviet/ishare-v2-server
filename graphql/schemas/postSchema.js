import * as Yup from 'yup';

const content = Yup.string()
    .min(3, 'Content must be at least 3 characters!')
    .max(1000, 'Content cannot be longer than 1000 characters!')
    .required('Content cannot be empty!');
const images = Yup.array()
    // .of(Yup.string().required('Image url can not be empty!'))
    .required('Image must be required!');

export const createPostSchema = Yup.object({
    content,
    images,
});
