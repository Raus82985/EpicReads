import React from "react";
import logo from "../../assets/nobglogo.jpg";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="h-[80vh] flex flex-col md:flex-row items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="mb-12 md:mb-0 w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center px-6 lg:px-12">
        <h1 className="text-4xl lg:text-6xl font-bold text-yellow-200 text-center lg:text-left leading-tight lg:leading-snug">
          Discover Your Next Great Read
        </h1>
        <p className="mt-6 text-lg lg:text-xl text-zinc-300 text-center lg:text-left max-w-lg">
          Uncover captivating stories, enriching knowledge, and endless
          inspiration in our curated collection of books.
        </p>
        <div className="mt-8">
          <Link 
            to="/all-books"
            className="text-yellow-200 text-lg lg:text-xl font-semibold border border-yellow-200 px-8 lg:px-12 py-3 hover:bg-yellow-200 hover:text-zinc-900 transition-colors duration-300 rounded-full">
            Discover Books
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <img src={logo} alt="Logo" className="w-2/3 lg:w-full max-w-sm lg:max-w-lg object-contain" />
      </div>
    </div>
  );
}

export default Hero;
