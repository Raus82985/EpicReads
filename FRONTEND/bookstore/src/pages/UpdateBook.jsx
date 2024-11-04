import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Notification from "../components/Notification/Notification";
import { useSelector } from "react-redux";

function UpdateBook() {
  const { id } = useParams(); // Book ID from URL
  const navigate = useNavigate();
  const isadmin = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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

  const showNotification = (message, color = "#32CD32") => {
    setNotification(message);
    setNotificationColor(color);
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch book data by ID on component mount
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v1/get-book-by-id/${id}`,
          {
            headers,
          }
        );
        setFormData(response.data.books);
      } catch (error) {
        showNotification("Failed to fetch book details.", "#FF0000");
      }
    };

    fetchBookDetails();
  }, [id]);

  // Update book details
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/update-book",
        formData,
        {
          headers: { ...headers, bookid: id },
        }
      );
      showNotification("Book updated successfully", "#32CD32");
      navigate(`/view-book-details/${id}`); // Redirect back to book details page after update
    } catch (error) {
      showNotification("Failed to update book.", "#FF0000");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        Update Book
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
        {[
          { name: "url", label: "Book Image URL" },
          { name: "title", label: "Book Title" },
          { name: "author", label: "Author" },
          { name: "Price", label: "Price", type: "number" },
          { name: "Descreption", label: "Description" },
          { name: "language", label: "Language" },
          { name: "pdfurl", label: "Book PDF URL" },
        ].map(({ name, label, type = "text" }) => (
          <div className="mb-4" key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium text-yellow-400"
            >
              {label}
            </label>
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleInputChange}
              required={name !== "pdfurl"}
              className="mt-1 p-2 w-full bg-zinc-700 text-white border border-zinc-600 rounded-lg shadow-sm focus:border-yellow-400 focus:ring-yellow-400"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-400 transition transform hover:scale-105"
        >
          Update Book
        </button>
      </form>
    </div>
  );
}

export default UpdateBook;
