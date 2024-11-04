import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../Bookcard/BookCard";
import { FaTrash } from "react-icons/fa";
import Notification from "../Notification/Notification";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Favourites() {
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationColor, setNotificationColor] = useState("#32CD32");

  const isadmin = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const showNotification = (message, color = "#32CD32") => {
    setNotificationMessage(message);
    setNotificationColor(color);
    setTimeout(() => {
      setNotificationMessage(null);
      setNotificationColor("#32CD32"); // Reset to default color if needed
    }, 3000);
  };

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const [favbooks, setFavbooks] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-favourite-books",
          { headers }
        );
        setFavbooks(response.data.books || []); // Ensure we always have an array
      } catch (error) {
        console.error("Error fetching favourite books:", error);
      }
    };

    fetch();
  }, [headers]);

  const removeFromFavourites = async (bookId) => {
    try {
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: bookId,
      };

      const res = await axios.put(
        "http://localhost:1000/api/v1/remove-book-from-favourite",
        {},
        { headers }
      );
      showNotification(res.data.message, "#32CD32"); // Success message in green
      setFavbooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookId)
      );
    } catch (error) {
      showNotification("Failed to remove book", "#FF0000"); // Error message in red
      console.error("Error removing book from favourites:", error);
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
  ) : isadmin == "admin" ? (
    <>
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="flex justify-center items-center text-4xl">
          Access Denied "NOT USER"
        </div>
        <div className="flex justify-center items-center">
          You are Not Authorised to access this page
        </div>
      </div>
    </>
  ) : (
    <div className="w-full h-full bg-zinc-900 p-6 md:p-8 lg:p-10 rounded-lg shadow-lg transition duration-300">
      <h1 className="text-3xl md:text-4xl text-yellow-400 mb-4 font-bold text-center">
        Favourite Books
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {notificationMessage && (
          <Notification
            message={notificationMessage}
            onClose={() => setNotificationMessage(null)}
            color={notificationColor}
          />
        )}
        {favbooks.length > 0 ? (
          favbooks.map((book) => (
            <div key={book._id} className="relative ">
              <BookCard data={book} />
              <button
                onClick={() => removeFromFavourites(book._id)}
                className="absolute bottom-0.5 right-10 left-10 bg-zinc-900 text-white flex justify-center py-1 px-2 rounded-full hover:bg-red-500 transition duration-200"
              >
                <FaTrash />
              </button>
            </div>
          ))
        ) : (
          <p className="text-zinc-400 text-center col-span-full">
            You have no favourite books.
          </p>
        )}
      </div>
    </div>
  );
}

export default Favourites;
