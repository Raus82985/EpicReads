import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Notification from "../components/Notification/Notification";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Cart() {
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationColor, setNotificationColor] = useState("#32CD32");
  const [promoCode, setPromoCode] = useState(""); // State for promo code
  const [discount, setDiscount] = useState(0); // State for discount amount

  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const showNotification = (message, color = "#32CD32") => {
    setNotificationMessage(message);
    setNotificationColor(color);
    setTimeout(() => setNotificationMessage(null), 3000);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1000/api/v1/get-user-cart",
          { headers }
        );
        console.log(res.data.data);

        setCart(res.data.data);
        const cartTotal = res.data.data.reduce(
          (sum, item) => sum + item.Price,
          0
        );
        setTotal(cartTotal);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  const deleteItem = async (bookId) => {
    try {
      await axios.put(
        `http://localhost:1000/api/v1/remove-book-from-cart`,
        {},
        { headers: { ...headers, bookid: bookId } }
      );
      setCart((prevCart) => prevCart.filter((item) => item._id !== bookId));
      setTotal(
        (prevTotal) =>
          prevTotal - cart.find((item) => item._id === bookId).Price
      );
      showNotification("Item removed successfully!", "#32CD32");
    } catch (error) {
      showNotification("Failed to remove item", "#FF0000");
      console.error("Error deleting item:", error);
    }
  };

  //add to order
  const handelorder = async () => {
    try {
      const res = await axios.post(
        "http://localhost:1000/api/v1/add-book-to-order",
        { order: cart },
        { headers }
      );
      showNotification("Order Placed Successfully", "#32CD32");
      navigate("/profile/orderhistory");
    } catch (err) {
      console.log(err);
    }
  };

  // Function to apply the promo code
  const applyCoupon = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/validate-promo", // Replace with your actual validation endpoint
        { code: promoCode },
        { headers }
      );
      // console.log(response.data);

      // Assume the response contains the discount percentage
      const discountValue = response.data.discountValue; // Adjust based on your backend response
      const discounttype = response.data.discountType;
      if (discounttype === "fixed") {
        var discountAmount = 0;
        if (total >= discountValue) {
          discountAmount = discountValue;
        } else {
          discountAmount = total;
        }
        setDiscount(discountAmount);
        showNotification(
          `Coupon applied! You saved Rs. ${discountAmount}`,
          "#32CD32"
        );
      } else if (discounttype === "percentage") {
        var discountAmount = (total * discountValue) / 100; // Assuming discountValue is a percentage
        if (total < discountAmount) {
          discountAmount = total;
        }
        setDiscount(discountAmount);
        showNotification(
          `Coupon applied! You saved Rs. ${discountAmount}`,
          "#32CD32"
        );
      } else {
        showNotification("Invalid promo code", "#FF0000");
      }
    } catch (error) {
      showNotification("Failed to apply promo code", "#FF0000");
      console.error("Error applying promo code:", error);
    }
  };

  // Calculate final total after discount
  const finalTotal = total - discount;

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
    <div className="flex bg-zinc-900 flex-col lg:flex-row gap-8 p-6 md:p-8 lg:p-10">
      {!cart && (
        <div className="flex items-center justify-center mx-auto mt-20">
          <Loader />
        </div>
      )}

      {cart && cart.length === 0 && (
        <div className="flex flex-col bg-zinc-900 items-center mx-auto justify-center h-screen">
          <div className="text-5xl lg:text-6xl font-semibold text-zinc-400">
            Empty Cart
          </div>
          <button
            onClick={() => navigate("/all-books")}
            className="mt-6 text-blue-500 hover:text-blue-600 focus:outline-none"
          >
            ← Continue Shopping
          </button>
        </div>
      )}

      {cart && cart.length > 0 && (
        <>
          <div className="w-full lg:w-2/3">
            <h1 className="text-3xl md:text-4xl text-yellow-400 mb-6 font-bold">
              Shopping Cart
            </h1>

            {notificationMessage && (
              <Notification
                message={notificationMessage}
                color={notificationColor}
                onClose={() => setNotificationMessage(null)}
              />
            )}

            <div className="grid gap-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start bg-zinc-800 p-4 rounded-lg transition-all"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />

                  <div className="flex flex-col flex-1">
                    <h2 className="text-2xl text-zinc-100 font-semibold">
                      {item.title}
                    </h2>
                    <p className="text-zinc-300 mt-2">
                      {item.Descreption.slice(0, 50)}...
                    </p>
                    <p className="text-2xl text-zinc-100 font-semibold mt-2 lg:hidden">
                      Rs. {item.Price}
                    </p>

                    <button
                      onClick={() => deleteItem(item._id)}
                      className="flex items-center text-red-600 mt-2 focus:outline-none hover:text-red-700"
                    >
                      <AiFillDelete size={20} className="mr-1" />
                      Remove
                    </button>
                  </div>

                  <div className="hidden lg:flex items-center text-2xl text-zinc-100 font-semibold">
                    Rs. {item.Price}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/all-books")}
              className="mt-6 text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              ← Continue Shopping
            </button>
          </div>

          <div className="w-full lg:w-1/3 bg-zinc-800 p-6 rounded-lg">
            <h2 className="text-3xl font-semibold text-yellow-400 mb-6">
              Order Summary
            </h2>
            <p className="text-lg text-zinc-300 mb-2">Items: {cart.length}</p>
            <div className="flex justify-between text-lg text-zinc-300 mb-4">
              <span>Subtotal</span>
              <span>Rs. {total}</span>
            </div>

            <div className="my-4">
              <label
                htmlFor="coupon"
                className="block text-lg text-zinc-300 mb-2"
              >
                Promo Code
              </label>
              <input
                type="text"
                id="coupon"
                placeholder="Enter your code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full p-2 rounded-md text-zinc-900 focus:outline-none"
              />
              <button
                onClick={applyCoupon}
                className="w-full bg-red-600 text-white p-2 mt-2 rounded-md transition duration-200 hover:bg-red-700"
              >
                APPLY
              </button>
            </div>

            <div className="flex justify-between text-lg text-zinc-300 mt-6 font-semibold">
              <span>Total Cost</span>
              <span>Rs. {finalTotal.toFixed(2)}</span>{" "}
              {/* Display final total */}
            </div>

            <button
              className="w-full bg-blue-600 text-white p-3 mt-6 rounded-md text-lg font-semibold transition duration-200 hover:bg-blue-700"
              onClick={() => handelorder()}
            >
              CHECKOUT
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
