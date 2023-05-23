import React, { useEffect, useState } from 'react';
import './profile.css';
import { Link } from 'react-router-dom';
import { profile } from './pro_api';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';



export default function Profile() {

  const [response, setResponse] = useState('');
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [address, setAddress] = useState("");
  const [pnumber, setPnumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDOB] = useState("");
  const [password, setPassword] = useState("");
  const studentID = Cookies.get('user_id');
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/student_registration/api/${studentID}`);
        setData(response.data);
        setFname(response.data[0].first_name);
        setLname(response.data[0].last_name);
        setAddress(response.data[0].address);
        setPnumber(response.data[0].phone_number);
        setEmail(response.data[0].email);
        setDOB(response.data[0].date_of_birth);
        setPassword(response.data[0].password);

      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await profile({ fname, lname, address, pnumber, email, dob, password }, `${studentID}`);
      console.log(response); // do something with the response
      if (response)
          setResponse(response);
    } catch (error) {
      console.log(error); // handle the error
    }
  };

    return (
      <div className="profile-container">
        <div className="profile-form">
          <h4>Profile</h4>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder={data.first_name} value={fname} onChange={(e) => setFname(e.target.value)} required/>
            <input type="text" placeholder={data.last_name} value={lname} onChange={(e) => setLname(e.target.value)}  required/>
            <input type="text" placeholder={data.address} value={address} onChange={(e) => setAddress(e.target.value)} required/>
            <input type="tel" placeholder={data.phone_number} value={pnumber} onChange={(e) => setPnumber(e.target.value)} required/>
            <input type="email" placeholder={data.email} value={email} onChange={(e) => setEmail(e.target.value)}  required/>
            <input type="date" placeholder={data.date_of_birth} value={dob}  onChange={(e) => setDOB(e.target.value)}  required/>
            <input type="password" placeholder={data.password} value={password} onChange={(e) => setPassword(e.target.value)}  required/>
            <button class="btn btn-primary" type="submit">Update</button>
          </form>
         <p>{response}</p>
        </div>
      </div>
    );

}