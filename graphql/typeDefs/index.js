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
    }

    type Post {
        id: ID!
        content: String!
        images: [String!]!
        user: User!
        createdAt: String!
    }

    type Query {
        getPosts: [Post]
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
    }
`;
