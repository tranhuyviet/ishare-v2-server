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
            try {
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
            } catch (error) {
                return false;
            }
        },
    },
    Query: {
        // GET ALL POST
        getPosts: async (_, args) => {
            try {
                console.log('GET POSTS...', args);
                const { page } = args;

                const limit = 10;
                const skip = (page * 1 - 1) * limit;

                const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

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
                // const returnPost = {
                //     id: post.id,
                //     content: post.content,
                //     images: post.images,
                //     createdAt: post.createdAt,
                //     user: {
                //         id: user.id,
                //         name: user.name,
                //         avatarUrl: user.avatarUrl,
                //     },
                //     comments: post.comments,
                //     likes: post.likes,
                //     commentCount: 0,
                //     likeCount: 0,
                //     isLiked: false,
                // };
                // console.log(returnPost);
                const returnPost = await Post.findById(post.id);
                // console.log(returnPost);
                return returnPost;
            } catch (error) {
                return error;
            }
        },
    },
};
