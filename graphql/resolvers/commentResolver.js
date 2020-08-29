import Post from '../../models/postModel';

import checkAuth from '../../utils/checkAuth';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { commentSchema } from '../schemas/commentSchema';
import errorParse from '../../utils/errorParse';

export default {
    Mutation: {
        // CREATE COMMENT
        createComment: async (_, args, context) => {
            console.log('comment submit...', args);
            try {
                let errors = {};
                const user = checkAuth(context);

                if (!user) {
                    throw new AuthenticationError('Not authenticated');
                }

                try {
                    await commentSchema.validate(args, { abortEarly: false });
                } catch (error) {
                    console.log(error);
                    errors = errorParse(error);
                    console.log('errors object', errors);
                    throw new UserInputError('CREATE COMMENT ERROR - VALIDATE', { errors });
                }

                const { postId, comment } = args;

                // find the post
                const post = await Post.findById(postId);

                if (!post) {
                    throw new UserInputError('Post not found');
                }

                // const newComment = new Comment({
                //     comment,
                //     user: user.id,
                // });

                // const createdComment = await newComment.save();

                // post.comments.unshift(createdComment.id);

                post.comments.push({
                    comment,
                    user: user.id,
                    createdAt: new Date().toISOString(),
                });

                await post.save();

                // const returnPost = {
                //     id: post.id,
                //     comments: {
                //         id: post.comments[0].id,
                //         comment: post.comments[0].comment,
                //         createdAt: post.comments[0].createdAt,
                //         user: {
                //             id: user.id,
                //             name: user.name,
                //             avatarUrl: user.avatarUrl,
                //         },
                //     },
                // };
                const returnPost = await Post.findById(postId);
                console.log('created comment', returnPost);

                return returnPost;
            } catch (error) {
                return error;
            }
        },

        // DELETE COMMENT
        deleteComment: async (_, { postId, commentId }, context) => {
            try {
                const user = checkAuth(context);

                if (!user) {
                    throw new AuthenticationError('Not authenticated');
                }

                const post = await Post.findById(postId);

                if (!post) {
                    throw new UserInputError('Post not found');
                }

                const commentIndex = post.comments.findIndex((comment) => comment.id === commentId);

                if (post.comments[commentIndex].user.id !== user.id) {
                    throw new AuthenticationError('Action not allowed');
                }

                post.comments.splice(commentIndex, 1);
                await post.save();
                const returnPost = await Post.findById(postId);
                return returnPost;
            } catch (error) {
                return error;
            }
        },
    },
};
