import { gql } from 'apollo-server-express';
import './userTypeDef';

export default gql`
    type Post {
        id: ID!
        content: String!
        images: [String!]!
        user: User!
        createdAt: String!
    }

    extend type Mutation {
        createPost(content: String!, images: [String!]!): Post!
    }
`;
