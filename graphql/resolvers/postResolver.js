import Post from '../../models/postModel';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import checkAuth from '../../utils/checkAuth';
// import { createPostSchema } from '../schemas';
import { createPostSchema } from '../schemas/postSchema';
import errorParse from '../../utils/errorParse';

export default {
    Post: {
        commentCount: (parent) => {
            return parent.comments.length;
        },
        likeCount: (parent) => {
            return parent.likes.length;
        },
        isLiked: (parent, __, context) => {
            const user = checkAuth(context);

            if (!user) {
                throw new AuthenticationError('Not authenticated');
                // return false;
            }

            const isLike = parent.likes.find(
                (like) => like.user.id.toString() === user.id.toString()
            );

            if (isLike) {
                return true;
            } else {
                return false;
            }
        },
    },
    Query: {
        // GET ALL POST
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });

                if (!posts) {
                    throw new Error('Can not get posts');
                }

                // console.log(posts);
                return posts;
            } catch (error) {
                return error;
            }
        },

        // GET POST BY ID
        getPost: async (_, { postId }) => {
            try {
                const post = await Post.findById(postId);
                // const post = await (
                //     await Post.findById(postId).populate({
                //         path: 'comments',
                //         populate: {
                //             path: 'user',
                //             select: 'name avatarUrl',
                //         },
                //     })
                // )
                //     .populate('user', 'name avatarUrl')
                //     .execPopulate();

                // console.log('getPost', post);
                if (!post) {
                    throw new Error('Post not found');
                }

                return post;
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
                console.log(returnPost);
                return returnPost;
            } catch (error) {
                return error;
            }
        },
    },
};
