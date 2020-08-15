import axios from 'axios';

export const checkRecaptcha = async (recaptcha) => {
    try {
        const secret = process.env.RECAPTCHA_SECRET;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptcha}`;

        const res = await axios.post(url);

        if (res.data.success === false) {
            return 'Recaptcha timeout or duplicate. Please try again.';
        }

        return null;
    } catch (error) {
        return error;
    }
};
