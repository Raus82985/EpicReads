// PurchasedBooks.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import PdfViewer from "../PdfViewer/PdfViewer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PurchasedBooks = () => {
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [selectedBookUrl, setSelectedBookUrl] = useState(null);
  const [bookTitle, setBookTitle] = useState(null);
  
  const isadmin = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleOpen = (book) => {
    setSelectedBookUrl(book.pdfurl);
    setBookTitle(book.title);
  };

  const handleClose = () => {
    setSelectedBookUrl(null);
    setBookTitle(null);
  };

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/purchased-books",
          { headers }
        );
        setPurchasedBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching purchased books:", error);
      }
    };

    fetchPurchasedBooks();
  }, []);

  return (
    isLoggedIn === false ? (
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
    ) :
    <div className="bg-zinc-900 min-h-screen p-8 flex flex-col items-center text-white">
      <h1 className="text-3xl font-semibold mb-6 text-yellow-400">
        Your Purchased Books
      </h1>
      <ul className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedBooks.map((book) => (
          <li
            key={book.id}
            className="bg-zinc-800 p-4 rounded-lg shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:bg-zinc-700"
            onClick={() => handleOpen(book)}
          >
            <img src={book.image} alt="/" />
            <h2 className="text-xl font-semibold text-yellow-300">{book.title}</h2>
            <p className="text-sm text-zinc-400">by {book.author}</p>
          </li>
        ))}
      </ul>

      {/* PDF Viewer Component */}
      <PdfViewer
        pdfUrl={selectedBookUrl}
        bookTitle={bookTitle}
        onClose={handleClose}
      />
    </div>
  );
};

export default PurchasedBooks;
