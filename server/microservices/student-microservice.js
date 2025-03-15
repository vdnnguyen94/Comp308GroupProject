const { ApolloServer, gql } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/federation');
const express = require('express');
const mongoose = require('mongoose');
const config = require('../config.js');  // Corrected require
const Student = require('./models/student.model.js');  // Corrected require

const app = express();
const port = 3001;
const cors = require('cors');
app.use(cors());



mongoose.connect(config.mongoUri, { dbName: 'SchoolSystem' })
  .then(() => {
    console.log("SUCCESS Connected to MongoDB:", config.mongoUri);
    console.log("Using Database:", mongoose.connection.db.databaseName); 
  })
  .catch(err => {
    console.error("ERROR MongoDB connection error:", err);
  });

mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${config.mongoUri}`);
});

// Define the GraphQL schema (as you already have it)
const typeDefs = gql`
    type Query {
        _dummy: String
        listStudents: [Student]
        getStudent(studentNumber: String!): Student
    }
    type Mutation {
        login(studentNumber: String!, password: String!): String
    }
    type Student {
        id: ID
        studentNumber: String
        firstName: String
        lastName: String
        address: String
        city: String
        phoneNumber: String
        email: String
        program: String
        hobbies: String
        techSkills: String
        isAdmin: Boolean
        created: String
        updated: String
    }
`;

const resolvers = {
    Query: {
        _dummy: () => 'This is a dummy query',
        
        listStudents: async () => {
            // console.log("listStudents resolver called");  // Debugging log
            try {
                const students = await Student.find();  // Fetch all students
                // console.log("Fetched students:", students);  // Debugging log
                return students;
            } catch (err) {
                console.error("Error fetching students:", err);  // Error logging
                throw new Error("Error fetching students");
            }
        },

        getStudent: async (_, { studentNumber }) => {
            try {
                const student = await Student.findOne({ studentNumber });
                if (!student) throw new Error("Student not found");
                return student;
            } catch (err) {
                throw new Error("Error fetching student");
            }
        },
    },
    Mutation: {
        login: async (_, { studentNumber, password }) => {
            try {
                const student = await Student.findOne({ studentNumber });
                if (!student) throw new Error("Student not found");
        
                const isAuthenticated = student.authenticate(password);
                if (!isAuthenticated) throw new Error("Invalid password");
        
                return "User authenticated";
            } catch (err) {
                return err.message;
            }
        },
    }
};


// Create a new ApolloServer instance, and pass in your schema and resolvers
const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

app.listen(process.env.PORT || port, async () => {
    await server.start();
    server.applyMiddleware({ app });
    console.log(`Student microservice ready at http://localhost:${port}${server.graphqlPath}`)
});
