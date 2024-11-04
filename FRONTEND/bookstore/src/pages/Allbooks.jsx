import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/Bookcard/BookCard";

function Allbooks() {
  const [Data, SetData] = useState();
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://epic-reads-hazel.vercel.app/api/v1/get-all-books"
      );
      SetData(response.data.books);
    };
    fetch();
  }, []);
  return (
    <div className="bg-zinc-900 h-auto px-12 py-8">
      <div className="mt-8 px-4">
        <h4 className=" text-center font-semibold md:text-left text-3xl text-yellow-300">All Books</h4>
        {!Data && (
          <div className="flex items-center justify-center mt-20">
            <Loader />
          </div>
        )}
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Data &&
            Data.map((items, i) => (
              <div key={i} >
                <BookCard data={items} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Allbooks;
