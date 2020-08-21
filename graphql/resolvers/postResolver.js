import Post from '../../models/postModel';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import checkAuth from '../../utils/checkAuth';
// import { createPostSchema } from '../schemas';
import { createPostSchema } from '../schemas/postSchema';
import errorParse from '../../utils/errorParse';

export default {
    Query: {
        // GET ALL POST
        getPosts: async () => {
            try {
                const posts = await Post.find()
                    .sort({ createdAt: -1 })
                    .populate({
                        path: 'user',
                        select: 'name avatarUrl',
                    })
                    .exec();

                if (!posts) {
                    throw new Error('Can not get posts');
                }

                // console.log(posts);
                return posts;
            } catch (error) {
                return error;
            }
        },
    },

    Mutation: {
        // CREATE NEW POST
        createPost: async (_, args, context) => {
            try {
                console.log('create post....', args);
                let errors = {};
                const user = checkAuth(context);

                if (!user) {
                    throw new AuthenticationError('Not authenticated');
                }

                try {
                    await createPostSchema.validate(args, { abortEarly: false });
                } catch (error) {
                    errors = errorParse(error);
                    console.log('errors object', errors);
                    throw new UserInputError('CREATE POST ERROR - VALIDATE', { errors });
                }

                const { content, images } = args;

                const newPost = new Post({
                    content,
                    images,
                    user: user.id,
                });

                const post = await newPost.save();
                const returnPost = {
                    id: post.id,
                    content: post.content,
                    images: post.images,
                    createdAt: post.createdAt,
                    user: {
                        id: user.id,
                        name: user.name,
                        avatarUrl: user.avatarUrl,
                    },
                };

                return returnPost;
            } catch (error) {
                return error;
            }
        },
    },
};
