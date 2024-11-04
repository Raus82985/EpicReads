import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function UserOrderHistory() {
  const [orderHistory, setOrderHistory] = useState(null);
  const navigate = useNavigate();
  const isadmin = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleOrderClick = (orderId) => {
    navigate(`/view-book-details/${orderId}`);
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1000/api/v1/get-order-history",
          { headers }
        );
        setOrderHistory(res.data.books);
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    fetchOrderHistory();
  }, []);

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
  ) : (
    <div className="bg-zinc-900 p-6 md:p-8 lg:p-10 min-h-screen w-full">
      <h1 className="text-3xl md:text-4xl text-yellow-400 text-center font-bold mb-8">
        My Orders
      </h1>

      {!orderHistory && (
        <div className="flex items-center justify-center mt-20">
          <Loader />
        </div>
      )}

      {orderHistory && orderHistory.length === 0 && (
        <div className="flex items-center justify-center mt-20">
          <p className="text-2xl text-zinc-400">No orders found</p>
        </div>
      )}

      {orderHistory && orderHistory.length > 0 && (
        <div className="overflow-x-auto">
          <table className="hidden lg:table w-full text-left border-collapse">
            <thead className="bg-zinc-800 text-yellow-400">
              <tr>
                <th className="p-4">Sr.</th>
                <th className="p-4">Books</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Mode</th>
              </tr>
            </thead>
            <tbody className="text-zinc-100">
              {orderHistory.map((order, index) => (
                <tr
                  key={order._id}
                  className="border-b border-zinc-700 hover:bg-zinc-800 transition-colors"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{order.book.title}</td>
                  <td
                    className="p-4 text-blue-400 cursor-pointer hover:underline"
                    onClick={() => handleOrderClick(order._id)}
                  >
                    {order._id}
                  </td>
                  <td className="p-4">₹{order.book.Price}</td>
                  <td className={`p-4 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </td>
                  <td className="p-4">{order.paymentMode || "COD"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid gap-6 lg:hidden">
            {orderHistory.map((order, index) => (
              <div
                key={order._id}
                className="flex flex-col bg-zinc-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400">Order #{index + 1}</span>
                  <span
                    className={`text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <h2 className="text-xl text-zinc-100 font-semibold">
                  {order.book.title}
                </h2>
                <p
                  className="text-blue-400 mt-1 cursor-pointer hover:underline"
                  onClick={() => handleOrderClick(order.book._id)}
                >
                  Order ID: {order.book._id}
                </p>
                <p className="text-lg text-zinc-100 font-semibold mt-2">
                  Rs. {order.book.Price}
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  Mode: {order.paymentMode || "COD"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserOrderHistory;
