export default (error) => {
    const errors = {};
    if (error.inner) {
        error.inner.forEach((el) => {
            errors[el.path] = el.message;
        });
    } else {
        errors.global = 'Something went wrong. Please try again.';
    }

    return errors;
};
