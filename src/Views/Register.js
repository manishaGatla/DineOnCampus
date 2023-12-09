import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const RegisterPage = () => {
  const [confirmPassword, setConfirmPassword]= useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    level: '',
    department: '',
    contact: '',
    isAdmin: false,
    routingNumber: '',
    accountNumber: '',
    billingAddress: '',
    universityId: '',
    isRegistrationSuccessful: false
  });
  const [level, setLevel] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [walletBalance, setWalletBalance]= useState(null);
  const [cardType, setCardType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleRegister();
  };

  const checkValidation = async() =>{

  }

  const handleRegister = async () => {
    try {
      const UserData = {
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        department : formData.department,
        level: level,

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
      const req = { data: UserData, schema: "Users" }
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });
      if (response.ok) {
        const data = await response.json();
        if (true) {
          const req = { userId: data.insertedId, Balance: walletBalance }
          const response = await fetch('http://localhost:3001/api/add/Wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
          });
          if (response.ok) {
            window.location.href = "./login";
          }
        }
        else {
          window.location.href = "./login";
        }

      }
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <section>
      <div class="bg-w">
        <Link to="/login">
          <button class="button-header-color button-header mr-l-15">Login</button>
        </Link>
      </div>
      <div class="register-container">

        <h2 class="c-w">Register</h2>
        <form onSubmit={handleSubmit}>

          {/* isAdmin radio button */}
          {/* <label class="label-style-register c-w">
            <input class="margins checkbox-style"
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            isAdmin
          </label>
          <br /> */}

          {/* Basic fields */}
          <label class="label-style-register c-w">
            First Name:
            <input class="input-text-box-login margins mr-l-100" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          </label>
          <br />
          <label class="label-style-register c-w">
            Last Name:
            <input class="input-text-box-login margins mr-l-100" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </label>
          <br />
          

          <label class="label-style-register c-w">
            Email:
            <input class="input-text-box-login margins mr-l-100" type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <br />

          <label class="label-style-register c-w">
            Password:
            <input class="input-text-box-login margins mr-l-73"  type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>
          <br/>

          <label class="label-style-register c-w">
            Confirm Password:
            <input class="input-text-box-login margins" type="password" name="password" value={confirmPassword} onChange={(event)=> setConfirmPassword(event.target.value)} />
          </label>
          <br />



          {formData.password && confirmPassword &&  formData.password != confirmPassword && <label class="c-r"> Password is not matching, please reenter</label>}
          <br/>

          <label class="label-style-register c-w">
            Level:
            <select value={cardType} class=" mr-l-90 mr-r-15 select-style" onChange={(e) => setLevel(e.target.value)}>
                                        <option value="graduation">Graduation level</option>
                                        <option value="underGraduation">Under Graduation level</option>
                                        {/* Add other card types as needed */}
                                    </select>
          </label>
          <br />

          <label class="label-style-register c-w">
            Department:
            <input class="input-text-box-login margins mr-l-100" type="text" name="department" value={formData.department} onChange={handleChange} />
          </label>
          <br />

          <label class="label-style-register c-w">
            Contact:
            <input class="input-text-box-login margins mr-l-86" type="text" name="contact" value={formData.contact} onChange={handleChange} />
          </label>
          <br />


          <label class="label-style-register c-w">
            University ID:
            <input class="input-text-box-login margins mr-l-39"
              type="text"
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
            />
          </label>

          <br />

          <label class="label-style-register c-w">
            Add Amount to Wallet:
            <input class="input-text-box-login margins mr-l-100" type="text" name="name" value={walletBalance} onChange={(event)=> setWalletBalance(event.target.value)} />
          </label>
          <br />
          
          <div class="margins">
                            <div class="mr-r-15  margins ">
                                <label class="mr-r-15 margins label-style-register">
                                    Card Type:
                                    <select value={cardType} class=" mr-l-90 mr-r-15 select-style" onChange={(e) => setCardType(e.target.value)}>
                                        <option value="">Select Card Type</option>
                                        <option value="creditCard">Credit card</option>
                                        <option value="debitcard">Debit Card</option>
                                        {/* Add other card types as needed */}
                                    </select>
                                </label>
                            </div>

                            <div class="mr-r-15  margins ">

                                <label class="mr-r-15  margins label-style-register">
                                    Card Number:
                                    <input class="mr-r-15  mr-l-61 select-style"
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div class="mr-r-15  margins ">
                                <label class="mr-r-15 margins label-style-register">
                                    Card Holder Name:
                                    <input class="mr-r-15  mr-l-15 select-style"
                                        type="text"
                                        value={cardHolderName}
                                        onChange={(e) => setCardHolderName(e.target.value)}
                                    />
                                </label>

                            </div>
                            <div class="mr-r-15  margins ">
                                <label class="mr-r-15 margins label-style-register">
                                    CVV:
                                    <input class="mr-r-15 mr-l-53 select-style"
                                        type="text"
                                        value={securityCode}
                                        onChange={(e) => setSecurityCode(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div class="mr-r-15  margins ">
                                <label class="mr-r-15 margins label-style-register">
                                    Expiry Date:
                                    <input class="mr-r-15 mr-l-53 select-style"
                                        type="text"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>

          <button type="submit" class="margins login-btn">Register</button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
