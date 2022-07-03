const { User, Book } = require("../server/models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../server/utils/auth");

const resolvers = {
  Query: {
    //JWT token to check for existance of context.user
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");

        return userData;
      }

      throw new AuthenticationError("You are not logged in");
    },
  },
  //mutations start here
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (
      parent,
      { title, description, authors, bookId, image, link },
      context_id
    ) => {
      if (context.user) {
        const book = await Book.create({
          ...args,
          username: context.user.username,
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            $push: {
              savedBooks: {
                title,
                authors,
                description,
                bookId,
                image,
                link,
              },
            },
          },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const thought = await Book.deleteOne({ id: bookId });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pop: { savedBooks: book._id } },
          { new: true }
        );

        return book;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
