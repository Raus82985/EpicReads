import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../Notification/Notification"; // Adjust the path if necessary
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Addpromo = () => {
  const isadmin = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    applicableProducts: [],
    userRestrictions: [],
  });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const [promoCodes, setPromoCodes] = useState([]);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing promo codes on component mount
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/promos",
          { headers }
        );
        setPromoCodes(response.data);
      } catch (error) {
        console.error("Error fetching promo codes:", error);
      }
    };

    fetchPromoCodes();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromoCode((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new promo code
  const handleAddPromoCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/add-promo",
        promoCode,
        { headers }
      );
      setNotification(response.data.message);
      setError("");
      setPromoCodes((prev) => [...prev, response.data.promoCode]);
      setPromoCode({
        code: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
        usageLimit: "",
        applicableProducts: [],
        userRestrictions: [],
      });
    } catch (error) {
      setError(error.response?.data.message || "Error adding promo code");
      setNotification("");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a promo code
  const handleDeletePromoCode = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:1000/api/v1/delete-promo/${id}`,
        { headers }
      );
      setNotification(response.data.message);
      setError("");
      setPromoCodes((prev) => prev.filter((promo) => promo._id !== id));
    } catch (error) {
      setError(error.response?.data.message || "Error deleting promo code");
      setNotification("");
    } finally {
      setLoading(false);
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
  ) : isadmin === "admin" ? (
    <div className="p-4 bg-zinc-800 rounded-lg shadow-md items-center text-center">
      <h1 className="text-2xl font-bold mb-4 text-yellow-200">
        Manage Promo Codes
      </h1>

      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification("")}
          color="#32CD32"
        />
      )}
      {error && <div className="mb-4 text-red-500">{error}</div>}

      <form
        onSubmit={handleAddPromoCode}
        className="mb-6 bg-zinc-700 p-4 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-2 text-white underline">
          Add Promo Code
        </h2>
        <input
          type="text"
          name="code"
          value={promoCode.code}
          onChange={handleChange}
          placeholder="Promo Code"
          required
          className="border p-2 mb-2 w-full bg-zinc-900 text-white"
        />
        <select
          name="discountType"
          value={promoCode.discountType}
          onChange={handleChange}
          className="border p-2 mb-2 w-full bg-zinc-900 text-white"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <input
          type="number"
          name="discountValue"
          value={promoCode.discountValue}
          onChange={handleChange}
          placeholder="Discount Value"
          required
          className="border  p-2 mb-2 w-full bg-zinc-900 text-white"
        />
        <input
          type="date"
          name="startDate"
          value={promoCode.startDate}
          onChange={handleChange}
          required
          className="border  p-2 mb-2 w-full bg-zinc-900 text-white"
        />
        <input
          type="date"
          name="endDate"
          value={promoCode.endDate}
          onChange={handleChange}
          required
          className="border  p-2 mb-2 w-full bg-zinc-900 text-white"
        />
        <input
          type="number"
          name="usageLimit"
          value={promoCode.usageLimit}
          onChange={handleChange}
          placeholder="Usage Limit"
          required
          className="border p-2 mb-2 w-full bg-zinc-900 text-white"
        />
        <button
          type="submit"
          className={`bg-green-500 font-semibold rounded-lg text-zinc-900 p-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Promo Code"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-16 mb-6 text-white underline">
        Existing Promo Codes
      </h2>
      <ul>
        {promoCodes.map((promo) => (
          <li
            key={promo._id}
            className="flex bg-zinc-900 p-4 rounded-lg justify-between items-center mb-2 text-zinc-300"
          >
            <span>
              {promo.code} - {promo.discountValue} {promo.discountType}
            </span>
            <button
              onClick={() => handleDeletePromoCode(promo._id)}
              className={`bg-red-500 rounded-lg text-white p-1 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : (
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
  );
};

export default Addpromo;
