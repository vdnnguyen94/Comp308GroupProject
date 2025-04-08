const Alert = require('../models/alert.model');

const alertResolver = {
  Query: {
    getActiveAlerts: async (_, { city }, { user }) => {
      return await Alert.find({
        city,
        state: 'active',
        dismissedBy: { $ne: user.id }
      }).populate('owner');
    }
  },

  Mutation: {
    createAlert: async (_, { title, description, city }, { user }) => {
      const alert = new Alert({
        title,
        description,
        city,
        owner: user.id
      });
      await alert.save();
      return alert.populate('owner');
    },

    dismissAlert: async (_, { alertId }, { user }) => {
      const alert = await Alert.findById(alertId);
      if (!alert) throw new Error("Alert not found");

      if (!alert.dismissedBy.includes(user.id)) {
        alert.dismissedBy.push(user.id);
        await alert.save();
      }

      return alert.populate('owner');
    },

    expireAlert: async (_, { alertId }, { user }) => {
      const alert = await Alert.findById(alertId);
      if (!alert) throw new Error("Alert not found");

      // Only the owner can expire it
      if (alert.owner.toString() !== user.id) {
        throw new Error("Only the owner can expire this alert");
      }

      alert.state = 'expired';
      await alert.save();
      return alert.populate('owner');
    }
  }
};

module.exports = alertResolver;
