import Post from '../../models/postModel';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import checkAuth from '../../utils/checkAuth';
// import { createPostSchema } from '../schemas';
import { createPostSchema } from '../schemas/postSchema';
import errorParse from '../../utils/errorParse';
import { cloudinary } from '../../utils/cloudinary';
import _ from 'lodash';

export default {
    Post: {
        // commentCount: (parent) => {
        //     return parent.comments.length;
        // },
        // likeCount: (parent) => {
        //     return parent.likes.length;
        // },
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
        getPosts: async (parent, args) => {
            try {
                // console.log('GET POSTS...', args);
                // const { page } = args;

                // const limit = 10;
                // const skip = (page * 1 - 1) * limit;

                // const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

                const posts = await Post.find().sort({ createdAt: -1 });

                if (!posts) {
                    throw new Error('Can not get posts');
                }

                let returnPosts = posts.map((post) => {
                    return {
                        id: post.id,
                        content: post.content,
                        images: post.images,
                        user: post.user,
                        createdAt: post.createdAt,
                        comments: post.comments,
                        likes: post.likes,
                        commentCount: post.comments.length,
                        likeCount: post.likes.length,
                    };
                });

                if (args.type === 'TOPCOMMENTS') {
                    returnPosts = _.sortBy(returnPosts, ['commentCount']).reverse();
                }

                if (args.type === 'TOPLIKES') {
                    returnPosts = _.sortBy(returnPosts, ['likeCount']).reverse();
                }

                // console.log(returnPosts);

                /*
                const posts = await Post.aggregate([
                    {
                        $addFields: {
                            commentCount: { $size: '$comments' },
                            likeCount: { $size: '$likes' },
                        },
                    },
                    // lookup -> populate user of post
                    {
                        // $lookup: {
                        //     from: 'users',
                        //     localField: 'user',
                        //     foreignField: '_id',
                        //     as: 'user',
                        // },
                        $lookup: {
                            from: 'users',
                            let: { userId: '$user' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$_id', '$$userId'],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,
                                        avatarUrl: 1,
                                    },
                                },
                            ],
                            as: 'user',
                        },
                    },
                    {
                        $unwind: '$user',
                    },

                    // lookup -> populate user of comment
                    {
                        $unwind: '$comments',
                    },
                    {
                        $lookup: {
                            from: 'users',
                            let: { userIdComment: '$comments.user' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$_id', '$$userIdComment'],
                                        },
                                    },
                                },
                            ],
                            as: 'comments.user',
                        },
                    },
                    {
                        $unwind: '$comments.user',
                    },
                    {
                        $group: {
                            _id: '$_id',
                            content: { $first: '$content' },
                            images: { $first: '$images' },
                            user: { $first: '$user' },
                            createdAt: { $first: '$createdAt' },
                            comments: { $push: '$comments' },
                            commentCount: { $first: '$commentCount' },
                        },
                    },
                    // lookup -> populate user of like
                    {
                        $unwind: '$likes',
                    },

                    {
                        $lookup: {
                            from: 'users',
                            let: { userIdLike: '$likes.user' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$_id', '$$userIdLike'],
                                        },
                                    },
                                },
                            ],
                            as: 'likes.user',
                        },
                    },
                    {
                        $unwind: '$likes.user',
                    },

                    {
                        $group: {
                            _id: '$_id',
                            content: { $first: '$content' },
                            images: { $first: '$images' },
                            user: { $first: '$user' },
                            createdAt: { $first: '$createdAt' },
                            comments: { $push: '$comments' },
                            likes: { $push: '$likes' },
                            commentCount: { $first: '$commentCount' },
                            likeCount: { $first: '$likeCount' },
                        },
                    },

                    {
                        $project: {
                            content: 1,
                            images: 1,
                            createdAt: 1,
                            comments: 1,
                            likes: 1,
                            likeCount: 1,
                            commentCount: 1,
                            // likeCount: { $size: '$likes' },
                            // commentCount: { $size: '$comments' },
                            user: 1,

                            // 'user._id': 1,
                            // 'user.name': 1,
                            // 'user.avatarUrl': 1,
                            // 'comments._id': 1,
                            // 'comments.comment': 1,
                            // 'comments.createdAt': 1,
                            // 'comments.user._id': 1,
                            // 'comments.user.name': 1,
                            // 'comments.user.avatarUrl': 1,
                        },
                    },

                    {
                        $sort: { commentCount: -1 },
                    },
                ]);
                */

                // console.log(posts);
                // console.dir(posts, { depth: null });

                return returnPosts;
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

                post.commentCount = post.comments.length;
                post.likeCount = post.likes.length;
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
                console.log('IMAGES', images);

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
                returnPost.commentCount = returnPost.comments.length;
                returnPost.likeCount = returnPost.likes.length;
                // console.log(returnPost);
                return returnPost;
            } catch (error) {
                return error;
            }
        },

        // DELETE POST
        deletePost: async (_, { postId }, context) => {
            try {
                const user = checkAuth(context);

                if (!user) {
                    throw new AuthenticationError('Not authenticated');
                }

                const post = await Post.findById(postId);

                if (!post) {
                    throw new Error('Can not found post');
                }

                console.log('DELETE POST', postId);

                // checking permision to delete
                if (post.user.id === user.id) {
                    post.images.forEach(async (image) => {
                        const res = await cloudinary.uploader.destroy(image);
                        console.log('DELETE IMAGE RES', res);
                    });
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (error) {
                return error;
            }
        },
    },
};
