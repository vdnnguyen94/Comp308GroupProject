import React from 'react';
import { gql, useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './StudentList.css'; // Import the CSS file
import { Link } from 'react-router-dom';
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
const IS_LOGGED_IN_QUERY = gql`
  query IsLoggedIn {
    isLoggedIn {
      isLoggedIn
      studentNumber
    }
  }
`;

const StudentList = () => {
  const { loading, error, data } = useQuery(GET_STUDENTS_QUERY);
  const { loading: loadingLogin, error: errorLogin, data: loginData } = useQuery(IS_LOGGED_IN_QUERY);
  console.log('Login Data:', loginData);
  // console.log('Is Logged In:', loginData.isLoggedIn.isLoggedIn);
  // console.log('Student Number:', loginData.isLoggedIn.studentNumber);
  if (loading || loadingLogin) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (errorLogin) return <p>Error checking login: {errorLogin.message}</p>;
  return (
    <div className="student-list-container">
      <h2 className="text-center mb-4">Student List</h2>

      <div className="alert alert-info">
        {loginData.isLoggedIn ? (
          <p>You are logged in as Student #{loginData.studentNumber}</p>
        ) : (
          <p>You are not logged in</p>
        )}
      </div>

      <div className="card">
        <ul className="list-group list-group-flush">
          {data.listStudents.map((student) => (
            <li key={student.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{student.studentNumber}</strong> - {student.firstName} {student.lastName}
                </div>
                <div>{student.email}</div>
                <div>

                  <Link to={`/students/${student.studentNumber}`} className="btn btn-primary btn-sm">
                    View
                  </Link>
                </div>

              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentList;