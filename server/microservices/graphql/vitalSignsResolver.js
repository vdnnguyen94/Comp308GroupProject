// server/microservices/graphql/vitalSignsResolver.js
const VitalSigns = require('../models/VitalSigns.model.js'); // Model for VitalSigns

const vitalSignsResolvers = {
  Query: {
    listVitalSigns: async () => {
      try {
        return await VitalSigns.find();  // Fetch all vital signs
      } catch (err) {
        throw new Error('Error fetching vital signs');
      }
    },

    getVitalSign: async (_, { userId }) => {
      try {
        const vitalSign = await VitalSigns.findOne({ userId });
        if (!vitalSign) throw new Error('Vital sign not found for this user');
        return vitalSign;
      } catch (err) {
        throw new Error('Error fetching vital sign');
      }
    },
  },

  Mutation: {
    createVitalSign: async (_, { userId, heartRate, bloodPressure, temperature }) => {
        try {
          const existingVitalSign = await VitalSigns.findOne({ userId });
          if (existingVitalSign) {
            throw new Error('Vital sign already exists for this user');
          }
          const newVitalSign = new VitalSigns({
            userId,
            heartRate,
            bloodPressure,
            temperature,
            timestamp: new Date().toISOString(),
          });
  
          await newVitalSign.save();
          return newVitalSign;
        } catch (err) {
          throw new Error('Error creating vital sign');
        }
    },
    updateVitalSign: async (_, { userId, heartRate, bloodPressure, temperature }) => {
      try {
        const vitalSign = await VitalSigns.findOneAndUpdate(
          { userId },
          { heartRate, bloodPressure, temperature, timestamp: new Date().toISOString() },
          { new: true }
        );

        if (!vitalSign) throw new Error('Vital sign not found for this user');

        return vitalSign;
      } catch (err) {
        throw new Error('Error updating vital sign');
      }
    },

    deleteVitalSign: async (_, { userId }) => {
      try {
        const result = await VitalSigns.deleteOne({ userId });
        if (result.deletedCount === 0) throw new Error('Vital sign not found for this user');
        return 'Vital sign deleted successfully';
      } catch (err) {
        throw new Error('Error deleting vital sign');
      }
    },
  },
};

module.exports = vitalSignsResolvers;
