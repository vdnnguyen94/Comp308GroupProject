import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom"; 
// import { GET_STUDENT_BY_NUMBER } from "./queries"; 

const GET_STUDENT_BY_NUMBER = gql`
  query GetStudentByNumber($studentNumber: String!) {
    getStudentByToken(studentNumber: $studentNumber) {
      studentNumber
      firstName
      lastName
      email
      address
      city
      phoneNumber
      program
      hobbies
      techSkills
      isAdmin
    }
  }
`;

const StudentDetail = () => {
  const { studentNumber } = useParams(); 
  const { data, loading, error } = useQuery(GET_STUDENT_BY_NUMBER, {
    variables: { studentNumber },
  });

  if (loading) return <p>Loading student details...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const student = data?.getStudentByToken;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div>
        <h2>Student Details</h2>
        {student ? (
          <ul>
            <li><strong>Student Number:</strong> {student.studentNumber}</li>
            <li><strong>Name:</strong> {student.firstName} {student.lastName}</li>
            <li><strong>Email:</strong> {student.email}</li>
            <li><strong>Address:</strong> {student.address}</li>
            <li><strong>City:</strong> {student.city}</li>
            <li><strong>Phone Number:</strong> {student.phoneNumber}</li>
            <li><strong>Program:</strong> {student.program}</li>
            <li><strong>Hobbies:</strong> {student.hobbies}</li>
            <li><strong>Tech Skills:</strong> {student.techSkills}</li>
            <li><strong>Admin:</strong> {student.isAdmin ? "Yes" : "No"}</li>
          </ul>
        ) : (
          <p>Student details not available</p>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
