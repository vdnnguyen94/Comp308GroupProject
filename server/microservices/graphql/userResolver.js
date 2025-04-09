const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../../config');

const userResolvers = {
  Query: {
    isLoggedIn: (_, __, { user }) => ({
      isLoggedIn: !!user,
      username: user?.username || null
    }),

    getUserByUsername: async (_, { username }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");
      return user;
    },

    getUserByToken: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const found = await User.findById(user.id);
      return found;
    },
    getUsers: async () => {
      return await User.find().sort({ createdAt: -1 }); 
    }
  },

  Mutation: {
    createUser: async (_, { username, email, password, fullName, city }) => {
      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) throw new Error("Username or email already taken");

      const newUser = new User({ username, email, password, fullName, city });
      await newUser.save();
      return newUser;
    },

    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await user.comparePassword(password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign({ id: user._id, username: user.username }, config.jwtSecret, {
        expiresIn: '1d'
      });

      res.cookie('CommunityApp', token, {
        httpOnly: true,
        maxAge: 86400000,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        //sameSite: 'None', 
        // sameSite: 'Lax'
      });

      return { success: true, message: 'Login successful' };

    },

    logout: (_, __, { res }) => {
      res.clearCookie('CommunityApp');
      return { message: 'Logged out successfully' };
    },

    updatePassword: async (_, { currentPassword, newPassword }, { user }) => {
      if (!user) throw new Error("Authentication required");
      const u = await User.findById(user.id);
      const valid = await u.comparePassword(currentPassword);
      if (!valid) throw new Error("Incorrect current password");

      u.password = newPassword;
      await u.save();
      return { message: "Password updated successfully" };
    }
  }
};

module.exports = userResolvers;
