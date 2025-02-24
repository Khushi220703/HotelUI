import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const LoginForm = ({ setloggedIn, closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
   
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      console.log(response);
      
      const data = await response.json();
      if (response.ok) {
        setSuccess('Login successful');
        setloggedIn(true);
        setError('');
        closeModal();
        localStorage.setItem("hotelAdminEmail", email);
        localStorage.setItem('token', data.token)
      } else {
        setError(data.message);
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred during login');
      setSuccess('');
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        style={modalStyles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        style={modalStyles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
     
      <button onClick={handleLogin} style={modalStyles.submitButton}>
        Login
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </div>
  );
};

export const SignupForm = ({setloggedIn, closeModal}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for isAdmin
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    const userData = { name, email, password, phone, role: isAdmin ? 'admin' : 'customer', address };
 
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      console.log(response.status);
      
      const data = await response.json();
      if (response.status === 201) {
        setSuccess('User registered successfully');
        toast.success("Please check your mail!");
        closeModal();
        setloggedIn(true);
        setError('');
      } else {
        setError(data.message);
        setSuccess('');
      }
    } catch (error) {
      console.log(error);
      
      setError('An error occurred during registration');
      setSuccess('');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        style={modalStyles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        style={modalStyles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        style={modalStyles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        style={modalStyles.input}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      
      {/* Toggle for isAdmin */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />
          Is Admin
        </label>
      </div>

      {/* Address Fields */}
      <div>
        <input
          type="text"
          placeholder="Street"
          style={modalStyles.input}
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          style={modalStyles.input}
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="State"
          style={modalStyles.input}
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />
        <input
          type="text"
          placeholder="Postal Code"
          style={modalStyles.input}
          value={address.postalCode}
          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          style={modalStyles.input}
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        />
      </div>
      
      <button onClick={handleSignup} style={modalStyles.submitButton}>
        Sign Up
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </div>
  );
};

const modalStyles = {
  input: {
    width: '90%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#FF5A5F',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  switchButton: {
    padding: '5px 10px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
    cursor: 'pointer',
  },
  closeButton: {
    padding: '5px 10px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
    cursor: 'pointer',
  },
};
