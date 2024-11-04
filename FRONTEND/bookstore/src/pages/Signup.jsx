import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import Loader from '../components/Loader/Loader'; // Assuming you have a Loader component
import Notification from '../components/Notification/Notification'; // Import the Notification component

function SignupPage() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [color, setColor] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:1000/api/v1/sign-up', formData);
      setNotificationMessage('Signup successful!');
      setColor("#32CD32")
      setSuccess(true);
      navigate('/login'); // Redirect to home page after successful signup
    } catch (err) {
      setColor("#ff0000");
      setError('Failed to signup. Please try again.');
      setNotificationMessage(err.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotificationMessage('');
    setSuccess(false);
  };

  return (
    <div className="bg-zinc-900 py-12 md:h-screen flex items-center justify-center px-4">
      <form className="bg-zinc-800 p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl text-yellow-200 text-center mb-6 hover:text-yellow-300">Sign Up</h2>

        {loading && (
          <div className="flex items-center justify-center mb-4">
            <Loader />
          </div>
        )}

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && (
          <div className="text-green-500 text-center mb-4">Signup successful!</div>
        )}

        <div className="mb-4">
          <label className="block text-white mb-1" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-zinc-600 rounded bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-zinc-600 rounded bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
            placeholder="Enter your email"
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

        <div className="mb-4">
          <label className="block text-white mb-1" htmlFor="address">
            Address
          </label>
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-3 border border-zinc-600 rounded bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
            placeholder="Enter your address"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-300 text-white font-bold py-2 rounded transition duration-200"
        >
          Sign Up
        </button>

        <div className="text-center mt-4">
          <p className="text-white">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')} // Redirect to login page
              className="text-yellow-500 hover:text-yellow-400 font-bold"
            >
              Log In
            </button>
          </p>
        </div>
      </form>

      {notificationMessage && (
        <Notification message={notificationMessage} onClose={handleCloseNotification} color={color}/>
      )}
    </div>
  );
}

export default SignupPage;
