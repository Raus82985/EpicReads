import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/nobglogo.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbAlignRight } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../Store/auth";

function Navbar() {
  const links = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    { title: "About Us", link: "/about-us" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
    { title: "Admin Profile", link: "/profile" },
  ];


  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAdmin = useSelector((state) => state.auth.role);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Remove Cart and Profile links for non-logged in users
  if (!isLoggedIn) {
    links.splice(3, 3);
  }

  if(isLoggedIn && isAdmin === "admin"){
    links.splice(3, 2);
  }

  if(isLoggedIn && isAdmin === "user"){
    links.splice(5, 2);
  }

  const location = useLocation();
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuVisible((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuVisible(false);
  const handellogout = () => {
    closeMobileMenu();
    dispatch(authActions.logout());
    dispatch(authActions.changeRole("user"));
    localStorage.clear("id");
    localStorage.clear("token");
    localStorage.clear("role");
    navigate("/login");
  }

  useEffect(() => {
    const handleResize = () => window.innerWidth >= 1024 && closeMobileMenu();
    const handleClickOutside = (event) =>
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target) &&
      closeMobileMenu();

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update body backdrop-blur based on mobile menu visibility
  useEffect(() => {
    document.body.classList.toggle("backdrop-blur", isMobileMenuVisible);
  }, [isMobileMenuVisible]);

  return (
    <>
      {/* Navbar */}
      <nav className="z-50 relative flex bg-zinc-800 text-white px-4 md:px-8 py-4 items-center justify-between shadow-md">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-14 h-14 mr-2 md:mx-4 rounded-full"
          />
          <h1 className="text-3xl font-bold tracking-wider text-yellow-200">
            EpicReads
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6">
            {links.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className={`text-lg font-medium transition duration-200 ${
                  location.pathname === item.link
                    ? "text-yellow-300"
                    : "hover:text-yellow-300"
                }`}
              >
                {item.title}
              </Link>
            ))}
            {/* Render Add Promo link if user is admin */}
          </div>
          <div className="hidden md:flex gap-4">
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border font-semibold border-yellow-400 text-yellow-200 rounded hover:bg-yellow-400 hover:text-zinc-800 transition duration-200"
                >
                  LogIn
                </Link>
                <Link
                  to="/signup"
                  className="font-semibold px-4 py-2 bg-yellow-400 text-zinc-800 rounded hover:bg-yellow-300 transition duration-200"
                >
                  SignUp
                </Link>
              </>
            )}
          </div>
          <button
            onClick={toggleMobileMenu}
            className="text-white text-3xl flex items-center md:hidden hover:text-yellow-300 transition duration-200"
          >
            <TbAlignRight />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuVisible && (
        <div className="fixed inset-0 z-40 bg-zinc-900 bg-opacity-80 flex justify-center backdrop-blur-sm">
          <div
            ref={mobileMenuRef}
            className="w-3/4 max-w-sm bg-zinc-800 text-center flex flex-col items-center mt-28 mb-auto rounded-lg shadow-lg p-6"
          >
            {links.map((item, index) => (
              <Link
                key={index}
                onClick={closeMobileMenu}
                to={item.link}
                className={`text-white text-xl font-semibold transition duration-200 mb-4 ${
                  location.pathname === item.link ? "text-yellow-300" : ""
                }`}
              >
                {item.title}
              </Link>
            ))}
            {!isLoggedIn && (
              <>
                <Link
                  onClick={closeMobileMenu}
                  to="/login"
                  className="w-full bg-zinc-200 text-xl font-semibold py-2 text-zinc-800 rounded-lg hover:bg-yellow-400 hover:text-zinc-800 transition duration-200 mb-4"
                >
                  LogIn
                </Link>
                <Link
                  onClick={closeMobileMenu}
                  to="/signup"
                  className="w-full text-xl font-semibold py-2 bg-yellow-400 rounded-lg hover:bg-yellow-300 transition duration-200"
                >
                  SignUp
                </Link>
              </>
            )}
            {isLoggedIn && (
              <button
                onClick={handellogout}
                className="w-full text-xl font-semibold py-2 bg-yellow-400 rounded-lg hover:bg-yellow-300 transition duration-200"
              >
                LogOut
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
