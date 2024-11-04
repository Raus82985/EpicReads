import React, { useEffect } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Allbooks from "./pages/Allbooks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Aboutus from "./pages/Aboutus";
import Profile from "./pages/profile";
import Contactus from "./pages/Contactus";
import ViewBookDetails from "./components/ViewBookDetails/ViewBookDetails";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./Store/auth";
import Favourites from "./components/Profile/Favourites";
import UserOrderHistory from "./components/Profile/UserOrderHistory";
import Settings from "./components/Profile/Settings";
import Addpromo from "./components/Profile/Addpromo";
import AllOrders from "./components/Profile/Allorders";
import PurchasedBooks from "./components/Profile/PurchasedBooks";
import AddBook from "./components/Profile/AddBook";
import UpdateBook from "./pages/UpdateBook";

function App() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if(
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role") 
    ){
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, []);
  return (
    <>
      {" "}
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/all-books" element={<Allbooks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} >
          <Route index element = {role == "user" ? <Favourites/> : <AllOrders/>}/>
          <Route path = "/profile/orderhistory" element = {<UserOrderHistory/>}/>
          <Route path = "/profile/settings" element = {<Settings/>}/>
          <Route path = "/profile/purchased-books" element = {<PurchasedBooks/>}/>
          <Route path = "/profile/add-promo" element = {<Addpromo/>}/>
          <Route path = "/profile/add-book" element = {<AddBook/>}/>
        </Route>

        <Route path="/about-us" element={<Aboutus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="view-book-details/:id" element={<ViewBookDetails />} />
        <Route path="/update-book/:id" element={<UpdateBook />} />
        
      </Routes>
      <Footer />
    </>
  );
}

export default App;
