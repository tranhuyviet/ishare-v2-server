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

    extend type Mutation {
        signup(
            name: String!
            email: String!
            password: String!
            confirmPassword: String!
            avatarId: String
            avatarUrl: String
        ): User!
        login(email: String!, password: String!): User!
        loginFacebook(facebookId: String!, accessToken: String!): User!
        loginGoogle(googleId: String, idToken: String!): User!
    }
`;
