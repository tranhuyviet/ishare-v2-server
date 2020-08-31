// import rootTypeDefs from './root';
// import user from './userTypeDef';
// import post from './postTypeDef';

// export default [rootTypeDefs, user, post];

import { gql } from 'apollo-server-express';

export default gql`
    type User {
        id: ID!
        email: String!
        name: String!
        avatarId: String
        avatarUrl: String
        createdAt: String
        token: String!
        confirmed: Boolean!
        numOfPosts: Int!
        numOfComments: Int!
        numOfLikes: Int!
    }

    type Post {
        id: ID!
        content: String!
        images: [String]!
        user: User!
        createdAt: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
        isLiked: Boolean!
    }

    # type Images {
    #     link: String!
    #     public_id: String!
    # }

    type Comment {
        id: ID!
        createdAt: String!
        user: User!
        comment: String!
    }

    type Like {
        id: ID!
        createdAt: String!
        user: User!
    }

    type Query {
        # getPosts(page: Int!): [Post!]
        getPosts: [Post!]!
        getPost(postId: ID!): Post!
    }

    type Mutation {
        # User
        signup(
            name: String!
            email: String!
            password: String!
            confirmPassword: String!
            recaptcha: String!
        ): User!
        login(email: String!, password: String!, recaptcha: String!): User!
        loginFacebook(facebookId: String!, accessToken: String!): User!
        loginGoogle(googleId: String, idToken: String!): User!
        # Post
        createPost(content: String!, images: [String!]!): Post!
        deletePost(postId: ID!): String!
        # Comment
        createComment(postId: ID!, comment: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        # Like
        likePost(postId: ID!): Post!
    }
`;
