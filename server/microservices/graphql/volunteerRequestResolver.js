const Volunteer = require('../models/volunteer.model');
const HelpRequest = require('../models/helprequest.model');
const { generateDiscussionSummary } = require('./service.summary');

const volunteerRequestResolver = {
  Query: {
    // VOLUNTEERS
    getVolunteers: async (_, { city }) => {
      const filter = city ? { city } : {};
      return Volunteer.find(filter).populate('user');
    },
    getVolunteer: async (_, { id }) => {
      return Volunteer.findById(id).populate('user');
    },
    getVolunteerByToken: async (_, __, { user }) => {
      if (!user) throw new Error("Login required");
      return Volunteer.find({ user: user.id }).populate('user');
    },

    // HELP REQUESTS
    getHelpRequests: async (_, { city }) => {
      const filter = city ? { city } : {};
      return HelpRequest.find(filter).populate('user').populate('bestMatches');
    },
    getHelpRequest: async (_, { id }) => {
      return HelpRequest.findById(id).populate('user').populate('bestMatches');
    },
    getHelpRequestByToken: async (_, __, { user }) => {
        return HelpRequest.findById({ user: user.id }).populate('user').populate('bestMatches');
      },
  },

  Mutation: {
    // CREATE VOLUNTEER
    createVolunteer: async (_, { city, interests, availability }, { user }) => {
      if (!user) throw new Error("Login required");

      const newVolunteer = new Volunteer({
        user: user.id,
        city,
        interests,
        availability
      });

      await newVolunteer.save();
      return newVolunteer.populate('user');
    },

    // CREATE HELP REQUEST
    createHelpRequest: async (_, { city, category, description }, { user }) => {
      if (!user) throw new Error("Login required");

      const request = new HelpRequest({
        user: user.id,
        city,
        category,
        description
      });

      await request.save();
      return request.populate('user');
    },

    // UPDATE AI ANALYSIS
    updateHelpRequestAnalysis: async (_, { id }) => {
      const request = await HelpRequest.findById(id).populate('user');
      if (!request) throw new Error("Help request not found");

      const volunteers = await Volunteer.find({ city: request.city }).populate('user');

      const { summary } = await generateDiscussionSummary(
        {
          title: `Help Request: ${request.category || 'General'}`,
          content: request.description
        },
        [], // no comments
        volunteers.map(v => ({
          name: v.user.fullName,
          city: v.city,
          interests: v.interests
        }))
      );

      request.analysis = summary;
      await request.save();
      return request;
    }
  }
};

module.exports = volunteerRequestResolver;
