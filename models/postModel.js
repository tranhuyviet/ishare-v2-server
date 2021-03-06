import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        comments: [
            {
                comment: String,
                createdAt: {
                    type: String,
                    default: Date.now(),
                },
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
        likes: [
            {
                createdAt: {
                    type: String,
                    default: Date.now(),
                },
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

postSchema.methods.postCount = async function postCount(userId) {
    const posts = await Post.find({ user: userId });
    return posts.length;
};

postSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name avatarUrl',
    })
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name avatarUrl',
            },
        })
        .populate({
            path: 'likes',
            populate: {
                path: 'user',
                select: 'name avatarUrl',
            },
        });

    next();
});

// postSchema.pre('save', function (next) {
//     this.populate({
//         path: 'user',
//         select: 'name avatarUrl',
//     });

//     next();
// });

const Post = model('Post', postSchema);

export default Post;
