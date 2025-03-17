import React from 'react';
import { gql, useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './StudentList.css'; // Import the CSS file

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
  const { loading, error, data } = useQuery(GET_STUDENTS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="student-list-container">
      <h2 className="text-center mb-4">Student List</h2>
      <div className="card">
        <ul className="list-group list-group-flush">
          {data.listStudents.map((student) => (
            <li key={student.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{student.studentNumber}</strong> - {student.firstName} {student.lastName}
                </div>
                <div>{student.email}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentList;