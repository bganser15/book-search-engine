// import the gql tagged template function
const { gql } = require("apollo-server-express");

//typeQuery puts each Thought into an array named thoughts: because each thought has multiple data types
// create our typeDefs

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
    bookCount: Int
  }

  type Book {
    bookId: String!
    authors: String
    description: String!
    image: String
    link: String
    title: String!

  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: String, title: String, description: String, bookID: String, image: String, link: String): User
    removeBook(bookId: String): User
  }

  type Auth {
    token: ID!
    user: User
  }
`;
// export the typeDefs
module.exports = typeDefs;
