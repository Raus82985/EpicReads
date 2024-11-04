import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../Notification/Notification";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Settings() {
  const [userInfo, setUserInfo] = useState({});
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationColor, setNotificationColor] = useState("#32CD32");

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const showNotification = (message, color = "#32CD32") => {
    setNotificationMessage(message);
    setNotificationColor(color);
    setTimeout(() => setNotificationMessage(null), 3000);
  };

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch user information
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-user-information",
        { headers }
      );
      setUserInfo(response.data);
      setAddress(response.data.address || ""); // Set initial address if available
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  // Update address
  const updateAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:1000/api/v1/update-address",
        { address },
        { headers }
      );
      showNotification("Address Updated successfully!", "#32CD32");

      fetchUserInfo(); // Refetch user info to reflect the updated address
    } catch (error) {
      console.error("Error updating address:", error);
      showNotification("Address Not Updated!", "#FF0000");
    }
  };

  // Change password
  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:1000/api/v1/change-password",
        { currentPassword, newPassword },
        { headers }
      );
      // Optionally reset fields after successful change
      setCurrentPassword("");
      setNewPassword("");
      showNotification("Password Updated successfully!", "#32CD32");
    } catch (error) {
      console.error("Error changing password:", error);
      showNotification(error.response.data.message, "#FF0000");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return isLoggedIn === false ? (
    <div className="flex flex-col h-screen bg-zinc-900 text-white font-semibold items-center justify-center gap-4">
      <div className="flex justify-center items-center text-5xl">
        Please Login
      </div>
      <button
        onClick={() => navigate("/login")}
        className="mt-6 text-blue-500 hover:text-blue-600 focus:outline-none text-xl"
      >
        ← Login
      </button>
    </div>
  ) : (
    <div className="bg-zinc-900 p-6 md:p-8 lg:p-10 min-h-screen w-full flex flex-col items-center">
      {notificationMessage && (
        <Notification
          message={notificationMessage}
          color={notificationColor}
          onClose={() => setNotificationMessage(null)}
        />
      )}

      <h1 className="text-3xl md:text-4xl text-yellow-400 font-bold mb-6">
        Settings
      </h1>

      <div className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-lg mb-8">
        <h2 className="text-xl text-yellow-400 mb-4">User Information</h2>
        <p className="text-zinc-100">Name: {userInfo.username}</p>
        <p className="text-zinc-100">Email: {userInfo.email}</p>
        <p className="text-zinc-100">
          Address: {userInfo.address || "No address set"}
        </p>
      </div>

      <form
        onSubmit={updateAddress}
        className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-lg mb-8"
      >
        <h2 className="text-xl text-yellow-400 mb-4">Update Address</h2>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter new address"
          className="bg-zinc-700 text-white p-2 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-400 text-zinc-900 p-2 rounded-md hover:bg-yellow-300 transition duration-300"
        >
          Update Address
        </button>
      </form>

      <form
        onSubmit={changePassword}
        className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl text-yellow-400 mb-4">Change Password</h2>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          className="bg-zinc-700 text-white p-2 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="bg-zinc-700 text-white p-2 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-400 text-zinc-900 p-2 rounded-md hover:bg-yellow-300 transition duration-300"
        >
          Change Password
        </button>
      </form>

      <p className="pt-10">
        Joined <span className="text-yellow-300">EpicReads</span> on:{" "}
        {new Date(userInfo.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default Settings;
