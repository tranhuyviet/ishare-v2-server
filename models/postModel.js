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
        // comments: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: 'Comment',
        //     },
        // ],
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
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
            {
                timestamps: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

postSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name avatarUrl',
    }).populate({
        path: 'comments',
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
