const Volunteer = require('../models/volunteer.model');
const HelpRequest = require('../models/helprequest.model');
const { generateHelpRequestAnalysis } = require('./service.summary');


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
        const request = await HelpRequest.findById(id);
        if (!request) throw new Error("Help request not found");
      
        // Step 1: Get all volunteers in same city
        const volunteers = await Volunteer.find({ city: request.city }).populate('user');
      
        // Step 2: Prepare payload for Gemini to analyze interests and availability
        const volunteerProfiles = volunteers.map(v => ({
          id: v.user._id.toString(), // So we can link matches later
          name: v.user.fullName,
          interests: v.interests,
          availability: v.availability
        }));
      
        // Step 3: Use Gemini to analyze & match
        const { analysis, bestMatches } = await generateHelpRequestAnalysis(request, volunteerProfiles);
      
        // Step 4: Extract matching user IDs from Gemini result
        const matchedIds = volunteers
          .filter(v => bestMatches.includes(v.user._id.toString()))
          .map(v => v.user._id);
      
        // Step 5: Save and return
        request.analysis = analysis;
        request.bestMatches = matchedIds;
        request.status = "matched";
        await request.save();
      
        return await HelpRequest.findById(request._id)
        .populate('user')
        .populate('bestMatches');
    },
    closeHelpRequest: async (_, { id }, { user }) => {
        const request = await HelpRequest.findById(id);
        if (!request) throw new Error("Help request not found");
      
        // Optionally check ownership
        if (request.user.toString() !== user.id)
          throw new Error("Not authorized to close this request");
      
        request.status = "closed";
        await request.save();
      
        return await HelpRequest.findById(id).populate('user').populate('bestMatches');
    },
    deleteVolunteer: async (_, { id }, { user }) => {
        const volunteer = await Volunteer.findById(id);
        if (!volunteer) throw new Error("Volunteer profile not found");
      
        if (volunteer.user.toString() !== user.id)
          throw new Error("Not authorized to delete this volunteer profile");
      
        await Volunteer.findByIdAndDelete(id);
        return true;
    },
      
      
    
      
  }
};

module.exports = volunteerRequestResolver;
