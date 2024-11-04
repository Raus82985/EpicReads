import React, { useState } from "react";
import axios from "axios";
import Notification from "../Notification/Notification"; // Assuming you have a notification component for messages
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function AddBook() {
  const isadmin = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    url: "",
    title: "",
    author: "",
    Price: "",
    Descreption: "",
    language: "",
    pdfurl: "",
  });
  const [notification, setNotification] = useState(null);
  const [notificationColor, setNotificationColor] = useState("#32CD32");

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showNotification = (message, color = "#32CD32") => {
    setNotification(message);
    setNotificationColor(color);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:1000/api/v1/add-book",
        formData,
        { headers }
      );
      showNotification(response.data.message, "#32CD32");
      setFormData({
        url: "",
        title: "",
        author: "",
        Price: "",
        Descreption: "",
        language: "",
        pdfurl: "",
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add book.";
      showNotification(message, "#FF0000");
    }
  };

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
  ) : isadmin == "user" ? (
    <>
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="flex justify-center items-center text-4xl">
          Access Denied
        </div>
        <div className="flex justify-center items-center">
          You are Not Authorised to access this page
        </div>
      </div>
    </>
  ) : (
    <div className="bg-zinc-900 flex flex-col items-center text-white w-full p-8">
      <h1 className="text-3xl font-semibold mb-6 text-yellow-400">
        Add a New Book
      </h1>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
          color={notificationColor}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full md:max-w-xl bg-zinc-800 p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label
            htmlFor="url"
            className="block text-sm font-medium text-yellow-400"
          >
            Book Image URL
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-yellow-400"
          >
            Book Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="author"
            className="block text-sm font-medium text-yellow-400"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="Price"
            className="block text-sm font-medium text-yellow-400"
          >
            Price
          </label>
          <input
            type="number"
            id="Price"
            name="Price"
            value={formData.Price}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="Descreption"
            className="block text-sm font-medium text-yellow-400"
          >
            Description
          </label>
          <input
            type="text"
            id="Descreption"
            name="Descreption"
            value={formData.Descreption}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="language"
            className="block text-sm font-medium text-yellow-400"
          >
            Language
          </label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="pdfurl"
            className="block text-sm font-medium text-yellow-400"
          >
            Book PDF URL
          </label>
          <input
            type="text"
            id="pdfurl"
            name="pdfurl"
            value={formData.pdfurl}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-400 transition transform hover:scale-105"
        >
          Add Book
        </button>
      </form>
    </div>
  );
}

export default AddBook;
