import React, { useEffect, useState } from 'react';
import './login.css';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { login } from './log_api';
import { useNavigate } from 'react-router-dom';

export default function Login(props) {

  const [state, setState] = useState('');
  const [response, setResponse] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await login({ email, password });
      if (response == 1){
        props.updateIsSignedIn(true);
        navigate('/dashboard');
      }
      else 
        setResponse(response);
    } catch (error) {
      console.log(error); // handle the error
    }
  };

    return (
      <div className="login-container">
        <div className="login-form">
          <h4>Login</h4>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <button class="btn btn-primary" type="submit">Submit</button>
          </form>
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          <p style={{color: 'red'}}>{response}</p>
        </div>
      </div>
    );

}

