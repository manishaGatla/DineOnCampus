import React from 'react';
import { BrowserRouter as Router, Route,Switch ,Routes, Link, Redirect } from 'react-router-dom';
import Login from './Views/login';
import Register from './Views/Register';
import UserHome from './Views/UserHome';
import AdminHome from './Views/AdminHome';
import MealPlans from './Views/MealPlans';
import Orders from './Views/order';
import Payments from './Views/Payments';
import ProfileDetails from './Views/profile';


function App() {
 
  return (   
    
    <div >
    <Routes>
    <Route index element={<Login/>} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/userHome" element={<UserHome />} />
    <Route path="/mealPlans" element={<MealPlans></MealPlans>}></Route>
    <Route path="/adminHome" element={<AdminHome />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/payment" element ={<Payments/>}/>
    <Route path="/profile" element ={<ProfileDetails/>}/>
  </Routes>
  </div> 
  );
}

export default App;
