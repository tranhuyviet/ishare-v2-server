import * as Yup from 'yup';

const name = Yup.string()
    .min(3, 'Name must be at least 3 characters!!!')
    .max(50, 'Name cannot be longer than 50 characters!!!')
    .required('Name cannot be empty!!!');
const email = Yup.string().required('Email cannot be empty').email('Invalid email format');
const password = Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password cannot be empty');
const confirmPassword = Yup.string()
    .required('Confirm Password cannot be empty')
    .oneOf([Yup.ref('password')], 'Password not match');
const recaptcha = Yup.string().required('Recaptcha verification is required');

export const signupSchema = Yup.object({
    name,
    email,
    password,
    confirmPassword,
    recaptcha,
});

export const loginSchema = Yup.object({
    email,
    password,
    recaptcha,
});
