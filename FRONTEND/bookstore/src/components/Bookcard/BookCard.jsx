import React from "react";
import { Link } from "react-router-dom";

function BookCard({ data }) {
  return (
    <div className="max-w-sm mx-auto shadow-lg rounded overflow-hidden transition-transform transform hover:scale-105 duration-300">
      <Link to={`/view-book-details/${data._id}`}>
        <div className="bg-zinc-800 rounded p-6 flex flex-col items-center">
          <div className="bg-zinc-900 rounded overflow-hidden w-full flex items-center justify-center aspect-w-3 aspect-h-4">
            <img
              src={data.url}
              className="h-[25vh] object-cover"
              alt="Book Cover"
            />
          </div>
          <h2 className="mt-4 text-xl text-zinc-200 font-semibold text-center">
            {data.title}
          </h2>
          <h3 className="mt-2 text-md text-zinc-400 text-center">
            {data.author}
          </h3>
          <p className="mt-2 text-lg text-zinc-200 font-semibold">
            Rs. {data.Price}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default BookCard;
