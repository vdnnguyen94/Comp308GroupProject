const Student = require('../models/student.model.js');
const jwt = require('jsonwebtoken');
const config = require('../../config.js');

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
    isLoggedIn: (_, __, { user, req }) => {
      console.log("Debug")
      // console.log("Request object:", req);
      // Log the cookies to see if they are correctly sent
      console.log("Cookies in the request:", req.cookies);
      // Log the user object to verify it's set correctly
      console.log("User object from context:", user);
      return {
        isLoggedIn: !!user,
        studentNumber: user ? user.studentNumber : null,
      };
    },
  },
  Mutation: {
    login: async (_, { studentNumber, password }, { res }) => {
      try {
        const student = await Student.findOne({ studentNumber });
        if (!student) throw new Error('Student not found');

        const isAuthenticated = student.authenticate(password);
        if (!isAuthenticated) throw new Error('Invalid password');
        console.log("Debug JWTSecrete in Login: ", config.jwtSecret);
        const token = jwt.sign(
          { _id: student._id, studentNumber: student.studentNumber, isAdmin: student.isAdmin || false },
          config.jwtSecret,
          { expiresIn: '1d' }
        );

        if (!res) {
          console.log(" NO RESS in Login");
          throw new Error("Response object is missing in context");
        }
        // Set JWT as HTTP-only cookie
        res.cookie('SchoolSystem', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          path: '/',
        });
        console.log('Generated token:', token);
        console.log("COOKIE SET");

        return { message: 'Login successful' };
      } catch (err) {
        return { message: err.message };
      }
    },
    logOut: (_, __, { res }) => {
      res.clearCookie('SchoolSystem'); 
      return { message: 'Logged out successfully!' };
    },
  },
};

module.exports = studentResolvers;
