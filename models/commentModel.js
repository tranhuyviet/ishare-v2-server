import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema(
    {
        comment: String,
        // createdAt: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// commentSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'user',
//         select: 'name avatarUrl',
//     });
//     next();
// });

const Comment = model('Comment', commentSchema);

export default Comment;
