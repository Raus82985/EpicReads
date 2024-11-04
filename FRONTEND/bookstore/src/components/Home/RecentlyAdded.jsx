import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import axios from "axios";
import BookCard from "../Bookcard/BookCard";

function RecentlyAdded() {
  const [data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-recent-books"
      );
      setData(response.data.books);
    };
    fetch();
  }, []);

  return (
    <div className="mt-8 md:px-4 bg-zinc-900 py-10 rounded-lg shadow-lg">
      <h4 className="text-xl md:text-4xl text-yellow-200 text-center md:text-left font-bold mb-6">
        Recently Added Books
      </h4>
      {!data ? (
        <div className="flex items-center justify-center mt-20">
          <Loader />
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, i) => (
            <div key={i} className="transition-transform transform hover:scale-105">
              <BookCard data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentlyAdded;
