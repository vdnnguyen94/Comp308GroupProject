const Student = require('../models/student.model.js');
const jwt = require('jsonwebtoken');
const config = require('../../config.js');

const studentResolvers = {
  Query: {
    listStudents: async () => {
      try {
        return await Student.find();
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
    isLoggedIn: (root, args, context) => {
      console.log("Debug: context" , context.user);
      console.log("Debug: context.user is", context.user);
      return {
        isLoggedIn: !!context.user,
        studentNumber: context.user ? context.user.studentNumber : null
      };
    },
    getStudentByToken: async (_, { studentNumber }, { user }) => {
      try {
        if (!user) {
          throw new Error('Sign in required');
        }
        if (user.studentNumber !== studentNumber) {
          throw new Error('Not Authorized: Token does not match the provided studentNumber');
        }
        const student = await Student.findOne({ studentNumber });
        if (!student) {
          throw new Error('Student not found');
        }
        return student;
      } catch (err) {
        throw new Error(err.message || 'Error fetching student');
      }
    },
  },
  Mutation: {
    createStudent: async (_, { studentNumber, firstName, lastName, email, password, address, city, phoneNumber, program, hobbies, techSkills, isAdmin }) => {
      try {
        const existingStudent = await Student.findOne({ studentNumber });
        if (existingStudent) {
          throw new Error('Student with this studentNumber already exists');
        }
        
        const newStudent = new Student({
          studentNumber,
          firstName,
          lastName,
          email,
          password,
          address,
          city,
          phoneNumber,
          program,
          hobbies,
          techSkills,
          isAdmin
        });
        
        await newStudent.save();
        return newStudent;
      } catch (err) {
        throw new Error('Error creating student: ' + err.message);
      }
    },
    deleteStudent: async (_, { studentNumber }) => {
      try {
        const student = await Student.findOneAndDelete({ studentNumber });
        if (!student) {
          throw new Error('Student not found');
        }
        return student;
      } catch (err) {
        throw new Error('Error deleting student: ' + err.message);
      }
    },
    login: async (_, { studentNumber, password }, { res }) => {
      try {
        const student = await Student.findOne({ studentNumber });
        if (!student) throw new Error('Student not found');

        const isAuthenticated = student.authenticate(password);
        if (!isAuthenticated) throw new Error('Invalid password');

        const token = jwt.sign(
          { _id: student._id, studentNumber: student.studentNumber, isAdmin: student.isAdmin || false },
          config.jwtSecret,
          { expiresIn: '1d' }
        );

        if (!res) {
          throw new Error("Response object is missing in context");
        }

        res.cookie('SchoolSystem', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
          secure: false,
          // domain: 'localhost',
          // sameSite: 'None',

        });
        console.log("SUCCESSFULLY LOGIN STUDENT: ", studentNumber);
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
