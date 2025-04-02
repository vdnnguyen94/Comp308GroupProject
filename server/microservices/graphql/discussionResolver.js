const Discussion = require('../models/discussion.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');

const discussionResolvers = {
  Query: {
    getDiscussions: async (_, { city }) => {
      const filter = city ? { city } : {};
      return await Discussion.find(filter).sort({ createdAt: -1 }).populate('author');
    },
    getDiscussion: async (_, { id }) => {
      return await Discussion.findById(id).populate('author');
    }
  },

  Mutation: {
    createDiscussion: async (_, { title, content, city }, { user }) => {
      if (!user) throw new Error("Login required");
      const discussion = new Discussion({
        title,
        content,
        city,
        author: user.id
      });
      await discussion.save();
      return discussion;
    },

    addComment: async (_, { discussionId, content }, { user }) => {
      if (!user) throw new Error("Login required");
      const comment = new Comment({
        content,
        discussion: discussionId,
        author: user.id
      });
      await comment.save();
      return comment;
    }
  },

  Discussion: {
    comments: async (discussion) => {
      return await Comment.find({ discussion: discussion.id }).sort({ createdAt: 1 }).populate('author');
    }
  },

  Comment: {
    author: async (comment) => {
      return await User.findById(comment.author);
    },
    discussion: async (comment) => {
      return await Discussion.findById(comment.discussion);
    }
  },
  deleteDiscussion: async (_, { id }, { user }) => {
    if (!user) throw new Error("Login required");
    const discussion = await Discussion.findById(id);
    if (!discussion) throw new Error("Discussion not found");
    if (String(discussion.author) !== user.id) throw new Error("Not authorized");
  
    await Comment.deleteMany({ discussion: id });
    await discussion.deleteOne();
    return { success: true, message: "Discussion deleted" };
  },
  
  deleteComment: async (_, { id }, { user }) => {
    if (!user) throw new Error("Login required");
    const comment = await Comment.findById(id).populate('discussion');
    if (!comment) throw new Error("Comment not found");
  
    const isCommentOwner = String(comment.author) === user.id;
    const isDiscussionOwner = String(comment.discussion.author) === user.id;
  
    if (!isCommentOwner && !isDiscussionOwner) {
      throw new Error("Not authorized");
    }
  
    await comment.deleteOne();
    return { success: true, message: "Comment deleted" };
  },
  updateDiscussion: async (_, { id, content }, { user }) => {
    if (!user) throw new Error("Login required");
    const discussion = await Discussion.findById(id);
    if (!discussion) throw new Error("Discussion not found");
    if (String(discussion.author) !== user.id) throw new Error("Not authorized");
  
    discussion.content = content;
    await discussion.save();
    return discussion;
  },
  
  updateComment: async (_, { id, content }, { user }) => {
    if (!user) throw new Error("Login required");
    const comment = await Comment.findById(id).populate('discussion');
    if (!comment) throw new Error("Comment not found");
  
    const isAuthor = String(comment.author) === user.id;
    if (!isAuthor) throw new Error("Not authorized");
  
    comment.content = content;
    await comment.save();
    return comment;
  }
  
  
};

module.exports = discussionResolvers;
