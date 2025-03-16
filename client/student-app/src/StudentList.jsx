import React from 'react';
import { gql, useQuery } from '@apollo/client';

// Define the query to get the list of students
const GET_STUDENTS_QUERY = gql`
  query GetStudents {
    listStudents {
      id
      studentNumber
      firstName
      lastName
      email
    }
  }
`;

const StudentList = () => {
  // useQuery hook for the get students query
  const { loading, error, data } = useQuery(GET_STUDENTS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Student List</h2>
      <ul>
        {data.listStudents.map((student) => (
          <li key={student.id}>
            {student.studentNumber} - {student.firstName} {student.lastName} - {student.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;