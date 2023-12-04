// Inside your components folder, create a new file Login.js


import React, { useState } from 'react';
import { Navigate, Route , Link} from 'react-router-dom';


import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState(null);


  const handleLogin = async () => {
    try {
      setMsg(null);
      setShowMsg(false);
      const req= {email : email}
      const response = await fetch('http://localhost:3001/api/login/?email='+ email);
      const result = await response.json();
      if(result && result.details.length > 0){
        if(result.details[0].password == password){
          const queryString = `?userId=${result.details[0]._id}`;
          if(result.role == 'Admin'){
            window.location.href ="./adminHome" + queryString;
          }
          else {
            
            window.location.href = "./userHome" + queryString;
          }
        }
        else{
          setShowMsg(true);
          setMsg('Incorrect Password');
          setEmail('');
          setPassword('');
        }
        

      } 
      else{
        setShowMsg(true);
        setMsg('User Not Found, Please register');
        setEmail('');
          setPassword('');
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

      {showMsg && <div class="margins mr-l-580 c-r">
        <label> {msg}</label>
      </div>}

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
