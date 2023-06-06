import React, { useEffect, useState } from 'react';
import './register.css';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { register } from './reg_api';


export default function Register() {

  const [response, setResponse] = useState('');
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [address, setAddress] = useState("");
  const [pnumber, setPnumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDOB] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await register({ fname, lname, address, pnumber, email, dob, password });
      console.log(response); // do something with the response
      if (response)
          setResponse(response);
    } catch (error) {
      console.log(error); // handle the error
    }
  };
    return (
      <div className="register-container">
        <div className="register-form">
          <h4>Register</h4>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="First name" value={fname} onChange={(e) => setFname(e.target.value)} required/>
            <input type="text" placeholder="Last name" value={lname} onChange={(e) => setLname(e.target.value)}  required/>
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required/>
            <input type="tel" placeholder="Phone number" value={pnumber} onChange={(e) => setPnumber(e.target.value)} required/>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
            <input type="date" placeholder="Date of birth" value={dob}  onChange={(e) => setDOB(e.target.value)}  required/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  required/>
            <button class="btn btn-primary" type="submit">Submit</button>
            <p><Link to="/">back</Link></p>
          </form>
          <p>{response}</p>
        </div>
      </div>
    );

}