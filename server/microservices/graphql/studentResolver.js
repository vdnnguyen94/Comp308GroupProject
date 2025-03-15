const Student = require('../models/student.model.js');

const studentResolvers = {
  Query: {
    _dummy: () => 'This is a dummy query',

    listStudents: async () => {
      try {
        return await Student.find();  // Fetch all students
      } catch (err) {
        throw new Error('Error fetching students');
      }
    },

    getStudent: async (_, { studentNumber }) => {
      try {
        const student = await Student.findOne({ studentNumber });
        if (!student) throw new Error('Student not found');
        return student;
      } catch (err) {
        throw new Error('Error fetching student');
      }
    },
  },
  Mutation: {
    login: async (_, { studentNumber, password }) => {
      try {
        const student = await Student.findOne({ studentNumber });
        if (!student) throw new Error('Student not found');

        const isAuthenticated = student.authenticate(password);
        if (!isAuthenticated) throw new Error('Invalid password');

        return {
          message: 'Valid Authentication',
        };
      } catch (err) {
        return {
          message: err.message,
        };
      }
    },
  },
};

module.exports = studentResolvers;
