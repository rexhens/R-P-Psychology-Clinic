import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogInForm.css'

function LoginForm() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const navigate = useNavigate(); // Hook to navigate between routes

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to the login API
      const response = await fetch('https://localhost:7175/api/admin/login?name=' + formData.name + '&password=' + formData.password, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const result = await response.json();

      // Store the API key in localStorage
      const apiKey = result.apiKey;
      localStorage.setItem('apiKey', apiKey);

      console.log('Login successful:', result);
 navigate('/homepage');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed! Please check your credentials.');
    }
  };

  return (
    <div id="big-container">
      <h1>Log In</h1>
      <form id="container" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" id='submitBtn'>Submit</button>
      </form>
    </div>
  );
}

export default LoginForm;
