import Post from '../../models/postModel';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import checkAuth from '../../utils/checkAuth';

export default {
    Mutation: {
        // TOGGLE LIKE POST
        likePost: async (_, { postId }, context) => {
            try {
                const user = checkAuth(context);

                if (!user) {
                    throw new AuthenticationError('Not authenticated');
                }

                const post = await Post.findById(postId);

                if (!post) {
                    throw new UserInputError('Can not found post');
                }

                // console.log(post, user.id);

                const isLike = post.likes.find((like) => {
                    // console.log(like.user.id.toString(), user.id.toString());
                    return like.user.id.toString() === user.id.toString();
                });

                //if liked already -> unlike it
                // console.log('isLike', isLike);
                if (isLike) {
                    post.likes = post.likes.filter(
                        (like) => like.user.id.toString() !== user.id.toString()
                    );
                } else {
                    // if not liked already -> like it
                    post.likes.unshift({
                        user: user.id,
                        createdAt: new Date().toISOString(),
                    });
                }

                await post.save();

                const returnPost = await Post.findById(postId);

                returnPost.commentCount = returnPost.comments.length;
                returnPost.likeCount = returnPost.likes.length;

                // console.log(returnPost);

                return returnPost;
            } catch (error) {
                return error;
            }
        },
    },
};
