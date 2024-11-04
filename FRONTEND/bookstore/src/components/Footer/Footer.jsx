import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation

function Footer() {
  return (
    <div className="bg-zinc-900 text-white px-8 py-6">
      <div className="border-t border-zinc-700 my-6 mx-auto w-5/6" />
      <div className="max-w-screen-lg mx-auto text-center flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-semibold">
          &copy; 2024 EpicReads, All Rights Reserved
        </h1>
        <p className="text-sm text-zinc-400">
          Your gateway to an endless world of books
        </p>
        <div className="flex space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="text-white hover:text-blue-500 text-xl transition duration-200" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="text-white hover:text-blue-400 text-xl transition duration-200" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-white hover:text-pink-500 text-xl transition duration-200" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-white hover:text-blue-600 text-xl transition duration-200" />
          </a>
        </div>
        {/* New Contact Us Link */}
        <Link to="/contact" className="text-white hover:text-yellow-500 text-sm transition duration-200">
          Contact Us
        </Link>
        <p className="text-sm text-zinc-400">
          Made with <span className="text-red-500">&hearts;</span> by EpicReads
          Team
        </p>
      </div>
    </div>
  );
}

export default Footer;
