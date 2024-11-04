import React from "react";
import { Link } from "react-router-dom"; // Import useLocation

function Aboutus() {
  return (
    <div className="bg-zinc-900">
      <div className="mx-10 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-300 px-6 lg:px-12">
      <h1 className="text-4xl lg:text-6xl font-bold text-yellow-200 mb-6 text-center">
        About Us
      </h1>
      <p className="mt-6 text-lg lg:text-xl text-center max-w-3xl">
        Welcome to our book haven, where we believe that every book is a gateway to new worlds, ideas, and inspiration. Our mission is to connect readers with an extensive collection of literature that sparks curiosity and enriches lives.
      </p>
      <p className="mt-4 text-lg lg:text-xl text-center max-w-3xl">
        Whether you are seeking fiction, non-fiction, or a hidden gem, our curated selection caters to every taste. We are dedicated to providing a seamless browsing experience, making it easier for you to discover your next great read.
      </p>
      <p className="mt-4 text-lg lg:text-xl text-center max-w-3xl">
        Join our community of passionate readers and embark on a journey through the pages of countless stories. Thank you for visiting our site, and we hope you find your next favorite book with us!
      </p>
      <div className="mt-8">
        <Link 
          to="/all-books"
          className="text-yellow-200 text-lg lg:text-xl font-semibold border border-yellow-200 px-8 lg:px-12 py-3 hover:bg-yellow-200 hover:text-zinc-900 transition-colors duration-300 rounded-full">
          Explore Our Collection
        </Link>
      </div>
    </div>
    </div>
  );
}

export default Aboutus;
