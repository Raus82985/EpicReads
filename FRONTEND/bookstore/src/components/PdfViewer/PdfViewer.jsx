// PdfViewer.js
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PdfViewer = ({ pdfUrl, bookTitle, onClose }) => {
  if (!pdfUrl) return null;

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();


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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl text-center bg-zinc-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
          {bookTitle}
        </h2>
        <iframe
          src={`${pdfUrl}#toolbar=0`}
          width="100%"
          height="600px"
          className="border-none rounded-lg shadow-lg"
        ></iframe>
        <button
          onClick={onClose}
          className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-400 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
