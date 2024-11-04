import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader'; // Assuming you have a Loader component
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation and useNavigate for redirection
import Notification from '../components/Notification/Notification'; // Import the Notification component
import { authActions } from '../Store/auth';
import { useDispatch } from 'react-redux';


function Login() {
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    username: '', // Input for username
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [color, setColor] = useState("#32CD32");
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotificationMessage('');

    try {
      const response = await axios.post('http://localhost:1000/api/v1/sign-in', formData);
      setNotificationMessage('Login successful!');
      setColor("#32CD32");

      //update the store
      dispatch(authActions.login());
      dispatch(authActions.changeRole(response.data.role));

      //store things in local storage
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
    
      navigate('/profile'); // Redirect to home page after successful login
    } catch (err) {
      console.log("i am in error");
      
      setError('Failed to login.');
      setNotificationMessage(err.response.data.message)
      setColor("#ff0000");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotificationMessage('');
  };

  return (
    <div className="bg-zinc-900 py-12 md:h-screen flex items-center justify-center px-4">
      <form className="bg-zinc-800 p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl text-yellow-200 text-center mb-6 hover:text-yellow-300">Log In</h2>

        {loading && (
          <div className="flex items-center justify-center mb-4">
            <Loader />
          </div>
        )}

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-white mb-1" htmlFor="username">
            Username {/* Updated label to Username */}
          </label>
          <input
            type="text"
            name="username" // Name attribute updated to username
            id="username" // ID updated to username
            value={formData.username} // State updated to username
            onChange={handleChange}
            required
            className="w-full p-3 border border-zinc-600 rounded bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
            placeholder="Enter your username" // Updated placeholder
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-zinc-600 rounded bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-300 text-white font-bold py-2 rounded transition duration-200"
        >
          Log In
        </button>

        <div className="mt-4 text-center">
          <p className="text-white">
            Don't have an account? 
            <Link to="/signup" className="text-yellow-300 hover:text-yellow-500 font-semibold ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </form>

      {notificationMessage && (
        <Notification message={notificationMessage} onClose={handleCloseNotification} color = {color}/>
      )}
    </div>
  );
}

export default Login;
