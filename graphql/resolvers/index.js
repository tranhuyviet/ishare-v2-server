import user from './userResolver';
import post from './postResolver';
import comment from './commentResolver';

export default [user, post, comment];

// import userResolver from './userResolver';
// import postResolver from './postResolver';
// import commentResolver from './commentResolver';

// export default {
//     Post: {
//         commentCount: (parent) => {
//             return parent.comments.length;
//         },
//     },
//     Query: {
//         ...postResolver.Query,
//     },
//     Mutation: {
//         ...postResolver.Mutation,
//         ...userResolver.Mutation,
//         ...commentResolver.Mutation,
//     },
// };
