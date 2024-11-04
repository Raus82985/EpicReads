import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { GrLanguage } from "react-icons/gr";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaBookOpen,
  FaEdit,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Notification from "../Notification/Notification";
import PdfViewer from "../PdfViewer/PdfViewer";

function ViewBookDetails() {
  const { id } = useParams();
  const [Data, SetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [notificationColor, setNotificationColor] = useState("#32CD32");
  const [showPdfViewer, setShowPdfViewer] = useState(false); // State to toggle PdfViewer

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isadmin = useSelector((state) => state.auth.role);

  const showNotification = (message, color = "#32CD32") => {
    setNotification(message);
    setNotificationColor(color);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/purchased-books",
          { headers }
        );
        setPurchasedBooks(response.data.books.map((book) => book.id));
      } catch (error) {
        console.error("Error fetching purchased books:", error);
      }
    };

    fetchPurchasedBooks();
  }, []);

  const handleFavourites = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-book-to-favourite",
        {},
        { headers }
      );
      const message = response.data.message;
      const color =
        message === "Book is already in favorites." ? "#FFFFFF" : "#32CD32";
      showNotification(message, color);
    } catch (err) {
      showNotification("Failed to add to favourites.", "#FF0000");
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-book-to-cart",
        {},
        { headers }
      );
      const message = response.data.message;
      console.log(message);

      const color =
        message === "Book is already in Cart." ? "#FFFFFF" : "#32CD32";
      showNotification(message, color);
    } catch (err) {
      showNotification("Failed to add to cart.", "#FF0000");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await axios.delete(
          `http://localhost:1000/api/v1/delete-book/`,
          { headers }
        );
        showNotification(response.data.message, "#32CD32");
        navigate("/all-books");
      } catch (err) {
        showNotification("Failed to delete the book.", "#FF0000");
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/update-book/${id}`); // Redirect to update page with the book ID
  };

  const handleRead = () => {
    setShowPdfViewer(true); // Open PdfViewer when "Read" is clicked
  };

  const handleClosePdfViewer = () => {
    setShowPdfViewer(false); // Close PdfViewer
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v1/get-book-by-id/${id}`
        );
        SetData(response.data.books);
      } catch (err) {
        setError("Failed to fetch book details.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-20">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <h1>{error}</h1>
      </div>
    );
  }

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
    <>
      {Data && (
        <div className="px-5 md:px-12 py-8 bg-zinc-900 flex flex-col md:flex-row gap-8 shadow-lg">
          <div className="flex-col w-full">
            {/* Notification */}
            {notification && (
              <Notification
                message={notification}
                onClose={() => setNotification(null)}
                color={notificationColor}
              />
            )}

            {/* First Row: Buttons */}
            {isLoggedIn && (
              <div className="flex justify-around gap-4 mb-4">
                {isadmin === "user" && (
                  <button
                    className="flex items-center gap-2 bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-400 transition transform hover:scale-105"
                    onClick={handleFavourites}
                  >
                    <FaHeart className="text-lg md:hidden" />
                    <span className="hidden md:inline">Add to Favourites</span>
                  </button>
                )}

                {isadmin === "user" &&
                  (purchasedBooks.includes(id) ? (
                    <button
                      className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-400 transition transform hover:scale-105"
                      onClick={handleRead}
                    >
                      <FaBookOpen className="text-lg md:hidden" />
                      <span className="hidden md:inline">Read</span>
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-400 transition transform hover:scale-105"
                      onClick={handleAddToCart}
                    >
                      <FaShoppingCart className="text-lg md:hidden" />
                      <span className="hidden md:inline">Add to Cart</span>
                    </button>
                  ))}

                {isadmin === "admin" && (
                  <button
                    className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-400 transition transform hover:scale-105"
                    onClick={handleDelete}
                  >
                    <FaTrash className="text-lg md:hidden" />
                    <span className="hidden md:inline">Delete</span>
                  </button>
                )}

                {isadmin === "admin" && (
                  <button
                    className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-400 transition transform hover:scale-105"
                    onClick={handleRead}
                  >
                    <FaBookOpen className="text-lg md:hidden" />
                    <span className="hidden md:inline">Read</span>
                  </button>
                )}

                {isadmin === "admin" && (
                  <button
                    className="flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-400 transition transform hover:scale-105"
                    onClick={handleUpdate}
                  >
                    <FaEdit className="text-lg md:hidden" />
                    <span className="hidden md:inline">Update</span>
                  </button>
                )}
              </div>
            )}

            {/* Second Row: Image and Details */}
            <div className="flex flex-col md:flex-row bg-zinc-800 rounded-lg shadow-lg p-4">
              <div className="md:w-3/6 h-[60vh] md:h-[70vh] flex items-center justify-center">
                <img
                  src={Data.url}
                  alt={Data.title}
                  className="h-full w-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="p-4 md:w-3/6 flex flex-col items-center md:items-start">
                <h1 className="text-center md:text-left text-4xl text-zinc-300 font-semibold mb-2 hover:underline">
                  {Data.title}
                </h1>
                <p className="text-center md:text-left text-zinc-400 mt-1 text-lg">
                  by {Data.author}
                </p>
                <p className="text-center md:text-left text-zinc-500 mt-4 text-xl">
                  {Data.Descreption}
                </p>
                <p className="text-center md:text-left text-zinc-300 text-lg flex mt-4 items-center">
                  <GrLanguage className="mr-3" /> {Data.language}
                </p>
                <p className="mt-4 text-zinc-100 text-3xl font-semibold">
                  Price: Rs. {Data.Price}
                </p>
              </div>
            </div>
          </div>

          {/* PDF Viewer Modal */}
          {showPdfViewer && (
            <PdfViewer
              pdfUrl={Data.pdfurl}
              bookTitle={Data.title}
              onClose={handleClosePdfViewer}
            />
          )}
        </div>
      )}
    </>
  );
}

export default ViewBookDetails;
