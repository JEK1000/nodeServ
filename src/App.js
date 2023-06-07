import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Login from './components/login/';
import Register from './components/register/';
import Dashboard from './components/dashboard/';
import Enrollment from './components/enrollment/';
import Profile from './components/profile/';
import Cookies from 'js-cookie';
import Protected from './privateRoute';

function App() {

  const [userName, setUserName] = useState("");
  const studentID = Cookies.get('user_id');
  const [isSignedIn, setIsSignedIn] = useState(false);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://containers-us-west-131.railway.app/student/api/${studentID}`);
         setUserName(response.data[0].first_name);
         console.log(response.data[0].first_name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

   const handleDeleteAccount = () => {
   const result = window.confirm("Are you sure you want to delete your account?");

    if (result) {
      // Delete account logic here
      console.log("Account deleted");
      axios.delete(`https://containers-us-west-131.railway.app/student_registration/delete/${studentID}`)
          .then(response => {
              console.log(response);
       });

      window.location.href = '/';
    } else {
      // User clicked "Cancel" or closed the dialog
      console.log("Account deletion canceled");
    }
  }

  const updateIsSignedIn = (value) => {
    setIsSignedIn(value);
  };

  const isSignedOut = () => {
    setIsSignedIn(false);
  };

  function path(){

    if (window.location.pathname === '/dashboard' || window.location.pathname === '/enrollment' || window.location.pathname === '/profile'){
      return(
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/dashboard" class="navbar-brand" >Student Registration System</Link>
            <div class="collapse navbar-collapse" id="navbarNav">
            <ul>
              <li><Link to="/enrollment">Enrollment</Link></li>
            </ul>
              <ul class="navbar-nav mr-auto"></ul>
              <ul class="navbar-nav">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Hi, {userName}!
                  </a>
                  <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                    <Link to="/profile" class="dropdown-item" >Profile</Link>
                    <a class="dropdown-item delete-account-link" onClick={handleDeleteAccount}>Delete Account</a>
                    <div class="dropdown-divider"></div>
                    <Link to="/" class="dropdown-item" href="/" onClick={isSignedOut} >Logout</Link>
                  </div>
                </li>
              </ul>
            </div>
          </nav>);
    }else {

    }

  }

  return (
    <Router>
      {path()}
      <Routes>
        <Route exact path="/" element={<Login updateIsSignedIn={updateIsSignedIn} />} />
        <Route exact path="/dashboard" element={<Protected isSignedIn={isSignedIn} > <Dashboard/> </Protected>} />
        <Route exact path="/enrollment" element={<Protected isSignedIn={isSignedIn} > <Enrollment /> </Protected>} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/profile" element={<Protected isSignedIn={isSignedIn} > <Profile /> </Protected>} />
      </Routes>
    </Router>
  );
}

export default App;

