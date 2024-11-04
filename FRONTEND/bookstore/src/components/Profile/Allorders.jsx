import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);

  const isadmin = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:1000/api/v1/get-all-orders",
        {
          headers,
        }
      );
      setAllOrders(res.data.books); // Assuming the response has an 'books' property
    } catch (error) {
      console.error("Error fetching all orders:", error);
    }
  };

  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:1000/api/v1/update-status/${orderId}`,
        { status: newStatus },
        { headers }
      );
      fetchAllOrders(); // Refetch orders to update the displayed list
    } catch (error) {
      console.error("Error changing order status:", error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

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
  ) : isadmin == "user" ? (
    <>
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="flex justify-center items-center text-4xl">
          Access Denied
        </div>
        <div className="flex justify-center items-center">
          You are Not Authorised to access this page
        </div>
      </div>
    </>
  ) : (
    <div className="bg-zinc-900 p-6 md:p-8 lg:p-10 min-h-screen w-full">
      <h1 className="text-3xl md:text-4xl text-yellow-400 text-center font-bold mb-8">
        All Orders
      </h1>
      {!allOrders && (
        <div className="flex items-center justify-center mt-20">
          <Loader />
        </div>
      )}

      {allOrders.length === 0 && (
        <div className="flex justify-center items-start text-5xl">
          No Orders
        </div>
      )}

      {allOrders.length > 0 && (
        <div className="flex flex-col space-y-4 ">
          {allOrders.map((order) => (
            <div
              key={order._id}
              className="bg-zinc-800 rounded-lg shadow-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between border border-zinc-700 hover:bg-zinc-600 transition duration-300 lg:mx-20"
            >
              <div className="flex-1">
                <p className="text-zinc-100">
                  Order ID: <span className="font-semibold">{order._id}</span>
                </p>
                <p className="text-zinc-100">
                  Book Title:{" "}
                  <span className="font-semibold">{order.book.title}</span>
                </p>
                <p className="text-zinc-100">
                  User ID:{" "}
                  <span className="font-semibold">{order.user._id}</span>
                </p>
                <p className="text-zinc-300">
                  Price:{" "}
                  <span className="font-semibold">₹{order.book.Price}</span>
                </p>
                <p className={`${getStatusColor(order.status)}`}>
                  Status: <span className="font-semibold">{order.status}</span>
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <select
                  onChange={(e) => changeOrderStatus(order._id, e.target.value)}
                  className="bg-zinc-700 text-white rounded-md p-2"
                >
                  <option value="" disabled selected>
                    Select Status
                  </option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  
  switch (status) {
    case "Order Placed":
      return "text-yellow-400";
    case "Out for Delivery":
      return "text-blue-400";
    case "Delivered":
      return "text-green-400";
    case "Canceled":
      return "text-red-400";
    default:
      return "text-zinc-400";
  }
};

export default AllOrders;
