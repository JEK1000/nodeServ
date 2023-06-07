import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import './enrollment.css';


export default function Enrollment() {

  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState([]);
  const studentID = Cookies.get('user_id');
  const [enrollmentData, setEnrollmentData] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://nodeserv-production.up.railway.app/api/enrollment/${studentID}`);
        setData(response.data);

      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  function unenrollStudent(courseId) {
    axios.delete(`https://nodeserv-production.up.railway.app/api/unenroll/${studentID}/${courseId}`)
        .then(response => {
        axios.get(`/api/enrollment/${studentID}`)
          .then(response => {
            setEnrollmentData(prevData => {
              // Filter out the unenrolled course from the previous enrollment data
              const updatedData = Array.isArray(prevData) ? prevData.filter(item => item.course_ID !== courseId) : [];
              // Add the updated enrollment data from the server
              updatedData.push(...response.data);
              // Return the updated enrollment data
              setData(updatedData);
            });
          })
        })
        .catch(error => {
            console.log(error);
            // handle unenrollment error
        });
}

  return (
    <div className="App">
      <div className="container">
        <h3>Schedule</h3>
        <table className="table">
        <thead>
          <tr>
            <th scope="col">Status</th>
            <th scope="col">Course</th>
            <th scope="col">Instructor</th>
            <th scope="col">Time</th>
            <th scope="col">Days</th>
            <th scope="col">Grading Basis</th>
            <th scope="col">Room No.</th>
            <th scope="col"></th>
          </tr>
        </thead>
        {data.length > 0 ? (        
        <tbody>
          {data && data.map((item) => (

            <tr>
              <td>{item.status}</td>
              <td>{item.course_name}</td>
              <td>{item.instructor_name}</td>
              <td>{item.start_time} - {item.end_time}</td>
              <td>{item.Days}</td>
              <td>{item.grade}</td>
              <td>{item.room_number}</td>
              <td>
                  <button
                    onClick={() => unenrollStudent(item.course_ID)} className="btn btn-danger btn-sm">Unenroll
                    </button>
              </td>
            </tr>
          ))}
        </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="8">No enrollment</td>
            </tr>
          </tbody>
        )}

      </table>
      </div>
    </div>
  );
}
