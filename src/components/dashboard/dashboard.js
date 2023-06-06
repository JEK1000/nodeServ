import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './dashboard.css';

export default function Dashboard() {

  const [data, setData] = useState([]);
  const studentID = Cookies.get('user_id');
  const [enrolled, setEnrolled] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseId, setCourseID] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/student_registration/dashboard');
        setData(response.data);
        setCourseID(response.data[0].course_ID);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  function handleEnrollment(courseId, courseName) {
    if (enrolledCourses.includes(courseId)) {
      //unenrollStudent(courseId);
      setEnrolledCourses(enrolledCourses.filter(id => id !== courseId));
    } else {
      // Otherwise, enroll the course
      enrollStudent(courseId, courseName);
      setEnrolledCourses([...enrolledCourses, courseId]);
    }
  }
  function enrollStudent(courseId, courseName) {
    axios.post(`http://localhost:3000/api/enroll/${studentID}/${courseId}`, {
    }).then(response => {
      // handle successful enrollment
      window.alert(`You have successfully enrolled in ${courseName}!`);

    }).catch(error => {
      console.log(error);
      // handle enrollment error
      window.alert(`You are already enrolled in ${courseName}.`);
    });
  }


  return (
    <div className="App">
      <div className="container">
        <h3>Courses</h3>
        <table className="table">
        <thead>
          <tr>
            <th scope="col">Course</th>
            <th scope="col">Instructor</th>
            <th scope="col">Time</th>
            <th scope="col">Days</th>
            <th scope="col">Room No.</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item) => (
            <tr key={item.course_ID}>
              <td>{item.course_name}</td>
              <td>{item.instructor_name}</td>
              <td>{item.start_time} - {item.end_time}</td>
              <td>{item.Days}</td>
              <td>{item.room_number}</td>
              <td>
              <button
                key={item.course_ID}
                onClick={() => handleEnrollment(item.course_ID, item.course_name)}
                className="btn btn-primary">
                Enroll
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
