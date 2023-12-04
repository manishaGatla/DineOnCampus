// Inside your components folder, create a new file Login.js


import React, { useState } from 'react';
import { Navigate, Route , Link} from 'react-router-dom';


import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async () => {
    try {
      const req= {email : email}
      const response = await fetch('http://localhost:3001/api/login/?email='+ email);
      const result = await response.json();     
      const queryString = `?userId=${result.details[0]._id}`;
      if(result.role == 'Admin'){
        window.location.href ="./adminHome" + queryString;
      }
      else {
        
        window.location.href = "./userHome" + queryString;
      }
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <section>
      <div class=" bg-w">
    <Link to="/register">
      <button class="button-header-color button-header mr-l-15">Register</button>
    </Link>
      </div>
    <section class="container">
      <div class="Login-css mr-l-580 c-w">
        <h2>Sign in to manage your account</h2>
      </div>
      <div class="margins mr-l-580">
        <input type="text" class="input-text-box-login" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div class="margins mr-l-580">
        <input type="password" class="input-text-box-login" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div class="margins mr-l-580">
        <button class ="login-btn" onClick={handleLogin}>Login</button>
      </div>
    </section>
    </section>
  );
  };
export default Login;
