import React, { useState,useEffect } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const checkUserName = () => {
    return localStorage.getItem('username');
   }
 
   useEffect(() => {
     const isLoggedIn = checkUserName();
     if (isLoggedIn){
      // window.location.href = "/dashboard/:id";
     }
 
   }, []);


   
  const handleLogin = async () => {
    try {
      const sanitizedUsername = sanitizeInput(username, 'Username');
      const sanitizedPassword = sanitizeInput(password, 'Password');

      const response = await axios.post('https://stunneagle-chat-2477de19fb41.herokuapp.com/login', {
        username: sanitizedUsername,
        password: sanitizedPassword,
      });
      if (response && response.data && response.data.message === 'Login successful') {
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        window.location.href = '/Dashboard'; 
      } 
    } catch (err) {
      
      setError( err.response?.data?.message  || err.message||  'An error occurred during login.');
    }
  };
  
  const sanitizeInput = (input, fieldName) => {
    // Remove leading and trailing whitespace
    const sanitizedInput = input.trim();
    // Ensure the input is not empty
    if (!sanitizedInput) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    // Return the sanitized input
    return sanitizedInput;
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-10">
      <h1 className="text-center font-bold text-3xl">Sign In</h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleLogin}
          >
            Sign In
          </button>
          <a href="/signup" className="text-blue-500 font-bold hover:text-blue-300">No account? Sign Up</a>
        </div>
        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
