import User from '../../models/userModel';
import { signupSchema, loginSchema } from '../schemas';
import { UserInputError } from 'apollo-server-express';
import errorParse from '../../utils/errorParse';
import axios from 'axios';

export default {
    Mutation: {
        signup: async (_, args) => {
            try {
                let errors = {};
                try {
                    await signupSchema.validate(args, { abortEarly: false });
                } catch (err) {
                    // err.inner.forEach((el) => {
                    //     errors[el.path] = el.message;
                    // });
                    errors = errorParse(err);

                    throw new UserInputError('SIGNUP ERROR - VALIDATE', { errors });
                }

                const { name, email, password, avatarId, avatarUrl } = args;

                const user = new User({
                    name,
                    email,
                    avatarId,
                    avatarUrl,
                });

                user.setPassword(password);

                try {
                    await user.save();
                } catch (err) {
                    //const errors = {};
                    // const errors = errorParse(err);
                    // console.log(errors);
                    // throw new UserInputError('SIGNUP ERROR - EMAIL EXIST', { errors });
                    if (err.errors.email.properties.message) {
                        errors.email = err.errors.email.properties.message;
                    } else {
                        errors.global = 'Something went wrong, please try again';
                    }

                    throw new UserInputError('SIGNUP ERROR - EMAIL EXIST', {
                        errors,
                    });
                }

                console.log('Signup Mutation');
                return user.toAuthJSON();
            } catch (error) {
                return error;
            }
        },

        //LOGIN
        login: async (_, args) => {
            try {
                console.log('login...');
                let errors = {};
                try {
                    await loginSchema.validate(args, { abortEarly: false });
                } catch (err) {
                    errors = errorParse(err);
                    throw new UserInputError('LOGIN ERROR - VALIDATE', { errors });
                }
                const { email, password } = args;

                const user = await User.findOne({ email });

                if (!user || !user.isValidPassword(password)) {
                    errors.global = 'Invalid credentials';
                    throw new UserInputError('LOGIN ERROR - INVALID CREDENTIALS', { errors });
                }

                console.log('login successful');
                return user.toAuthJSON();
            } catch (error) {
                console.log(error);
                return error;
            }
        },

        // LOGIN FACEBOOK
        loginFacebook: async (_, args) => {
            try {
                let errors = {};

                const { facebookId, accessToken } = args;
                console.log('id:', facebookId);
                console.log('access token:', accessToken);

                // check user login with facebook is existed already
                const existUser = await User.findOne({ facebookId });

                // if user is existed
                if (existUser) return existUser.toAuthJSON();

                // if user is not existed
                const url = `https://graph.facebook.com/${facebookId}?fields=id,name,email,picture&access_token=${accessToken}`;
                const user = await axios.get(url);

                if (!user) {
                    errors.global = 'Facebook login failed, please try again.';
                    throw new UserInputError('LOGIN FACEBOOK ERROR', { errors });
                }

                console.log('User', user.data);
                console.log('avatar', user.data.picture);

                const newUser = new User({
                    name: user.data.name,
                    email: user.data.email,
                    avatarUrl: user.data.picture.data.url,
                    facebookId,
                    confirmed: true,
                });

                console.log(newUser);

                try {
                    await newUser.save();
                } catch (err) {
                    if (err.errors.email.properties.message) {
                        errors.email = err.errors.email.properties.message;
                    } else {
                        errors.global = 'Something went wrong, please try again';
                    }

                    throw new UserInputError('SIGNUP ERROR - EMAIL EXIST', {
                        errors,
                    });
                }

                return newUser.toAuthJSON();
            } catch (error) {
                console.log(error);
                return error;
            }
        },

        // LOGIN GOOGLE
        loginGoogle: async (_, args) => {
            try {
                let errors = {};

                const { googleId, idToken } = args;
                console.log('id:', googleId);
                console.log('id token:', idToken);

                // check user login with google is existed already
                const existUser = await User.findOne({ googleId });

                // if user is existed
                if (existUser) return existUser.toAuthJSON();

                // if user is not existed
                const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
                const user = await axios.get(url);

                // if (!user) {
                //     errors.global = 'Google login failed, please try again.';
                //     throw new UserInputError('LOGIN GOOGLE ERROR', { errors });
                // }

                console.log('User', user.data);
                console.log('avatar', user.data.picture);

                const newUser = new User({
                    name: user.data.name,
                    email: user.data.email,
                    avatarUrl: user.data.picture,
                    googleId: user.data.sub,
                    confirmed: true,
                });

                // console.log(newUser);

                try {
                    await newUser.save();
                } catch (err) {
                    if (err.errors.email.properties.message) {
                        errors.email = err.errors.email.properties.message;
                    } else {
                        errors.global = 'Something went wrong, please try again';
                    }

                    throw new UserInputError('SIGNUP ERROR - EMAIL EXIST', {
                        errors,
                    });
                }

                return newUser.toAuthJSON();
            } catch (error) {
                console.log('AAAAAAAAA', error);
                return error;
            }
        },
    },
};
