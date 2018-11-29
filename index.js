const { ApolloServer, gql } = require("apollo-server");

import USERS from "./constants/users";
import PICTURES from "./constants/pictures";
import LIKES from "./constants/likes";

const typeDefs = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    likes: [Like]
    pictures: [Picture]
  }

  type Picture {
    id: ID
    name: String
    url: String
    ownerId: ID
    owner: User
    likes: [Like]
  }

  type Like {
    id: ID
    pictureId: ID
    picture: Picture
    likerId: ID
    liker: User
  }

  type Query {
    picture(id: String!): Picture
    pictures: [Picture]
    user(id: String!): User
    users: [User]
    like(id: String!): Like
    likes: [Like]
  }
`;

const resolvers = {
  Picture: {
    owner: picture => USERS.find(user => user.id === picture.ownerId),
    likes: picture => LIKES.filter(like => like.pictureId === picture.id)
  },
  Like: {
    picture: like => PICTURES.find(picture => picture.id === like.pictureId),
    liker: like => USERS.find(user => user.id === like.likerId)
  },
  User: {
    likes: user => LIKES.filter(like => like.likerId === user.id),
    pictures: user => PICTURES.filter(picture => picture.ownerId === user.id)
  },
  Query: {
    picture: (root, args, context, info) =>
      PICTURES.find(file => file.id == args.id),
    pictures: () => PICTURES,
    like: (root, args, context, info) => LIKES.find(like => like.id == args.id),
    likes: () => LIKES,
    user: (root, args, context, info) => USERS.find(user => user.id == args.id),
    users: () => USERS
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
