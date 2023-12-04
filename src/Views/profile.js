import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/login.css';
const ProfileDetails = () => {

  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const handleEdit = () => {
    setEditable(true);
  };


  useEffect(() => {

    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('userId')) {
      setUserId(searchParams.get('userId') || '');
    }
    setIsAdmin(searchParams.get('isAdmin'));
    getUserDetails()


  }, [location.search]);

  const getUserDetails = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const req = { userId: userId }
      const response = await fetch('http://localhost:3001/api/get/userdetails/?userId=' + searchParams.get('userId'));
      const result = await response.json();
      setIsAdmin(result.role == "Admin" ? true : false);
      setFormData(result.details[0]);
      setEmail(result.details[0].email);
    } catch (error) {
      // Handle login error
    }
  }


  const handleSave = async () => {
    const UserData = {
      password: formData.password,
      email: formData.email,
      name: formData.name,
      studentId: formData.universityId,
      contact: formData.contact
    }
    const AdminData = {
      password: formData.password,
      email: formData.email,
      name: formData.name,
      accountNumber: formData.accountNumber,
      routingNumber: formData.routingNumber,
      billingAddress: formData.billingAddress,
      contact: formData.contact
    }
    const req = { data: isAdmin ? AdminData : UserData, email: email };
    const response = await fetch(isAdmin ? 'http://localhost:3001/api/update/adminDetails' : 'http://localhost:3001/api/update/userDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
    if (response.ok) {
      const data = await response.json();
      setEditable(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <section>
      <div class="bg-w">
        <Link to="/login">
          <button class="butoon-logout-color button-header mr-l-15">LogOut</button>
        </Link>
        {!isAdmin && <Link to={`/orders?userId=${userId}&isAdmin=false`}>
          <button class="button-header-color button-header mr-l-15">View My Orders</button>
        </Link>}
        {isAdmin && <Link to={`/orders?userId=${userId}&isAdmin=true`}>
          <button class="button-header-color button-header mr-l-15">View All Orders</button>
        </Link>}
        {isAdmin &&
          <Link to={`/mealPlans?userId=${userId}&isAdmin=true`}>
            <button class="button-header-color button-header mr-l-15">Meal Plans</button>
          </Link>
        }

      </div>

      <div class="register-container">
        <label class="label-style-register c-w">Name:
          <input class="input-text-box-login margins mr-l-100"
            type="text"
            name="name"
            value={formData.name}
            readOnly={!editable}
            onChange={handleChange}
          /></label>
        <label class="label-style-register c-w">Email:
          <input class="input-text-box-login margins mr-l-100"
            type="email"
            name="email"
            value={formData.email}
            readOnly={!editable}
            onChange={handleChange}
          /></label>
        <label class="label-style-register c-w">Password:
          <input class="input-text-box-login margins mr-l-73"
            type="password"
            name="password"
            value={formData.password}
            readOnly={!editable}
            onChange={handleChange}
          />
        </label>
        {!isAdmin && <label class="label-style-register c-w">University ID:
          <input class="input-text-box-login margins mr-l-39"
            type="text"
            name="universityid"
            value={formData.studentId}
            readOnly={!editable}
            onChange={handleChange}
          /></label>
        }
        <label class="label-style-register c-w">Contact:
          <input class="input-text-box-login margins mr-l-86"
            type="text"
            name="contact"
            value={formData.contact}
            readOnly={!editable}
            onChange={handleChange}
          /></label>

        {!editable ? (
          <button class="input-text-box-login  margins  login-btn" onClick={handleEdit}>Update Details</button>
        ) : (
          <button class="input-text-box-login margins  login-btn" onClick={handleSave}>Save</button>
        )}
      </div>
    </section>
  );
};

export default ProfileDetails;
