import {
  FaSignOutAlt,
  FaHeart,
  FaHistory,
  FaCog,
  FaBook,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authActions } from "../../Store/auth";

function Sidebar({ data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isadmin = useSelector((state) => state.auth.role);

  const handleLogout = () => {
    dispatch(authActions.logout());
    dispatch(authActions.changeRole("user"));
    localStorage.clear("id");
    localStorage.clear("token");
    localStorage.clear("role");
    navigate("/login");
  };

  const getLinkClasses = (path) => 
    `flex items-center gap-3 py-2 w-full transition duration-300 ${location.pathname === path ? "text-yellow-300" : "hover:text-yellow-400"}`;

  return (
    <div className="bg-zinc-800 h-full md:h-screen p-6 rounded-lg flex flex-col items-center md:items-stretch text-center md:text-left shadow-lg w-full md:w-[220px] justify-between pb-10 border border-zinc-700 transition duration-300 sticky top-0">
      {/* Profile Section */}
      <div className="flex flex-col items-center md:items-center w-full text-center mb-6">
        <img
          src={data.avatar}
          alt="User Avatar"
          className="h-24 w-24 rounded-full border-2 border-yellow-400 shadow-lg mb-4 transition duration-300 transform hover:scale-105"
        />
        <p className="text-2xl font-semibold text-zinc-100">{data.username}</p>
        <p className="text-zinc-400 text-sm mb-4">{data.email}</p>
        <div className="border-t border-yellow-500 w-2/3 mt-4"></div>
      </div>

      {/* Navigation Links */}
      {isadmin === "user" ? (
        <nav className="flex flex-col w-full gap-4 text-zinc-300 items-center md:items-start">
          <Link to="/profile" className={getLinkClasses("/profile")}>
            <FaHeart className="text-yellow-400" />
            <span>Favourites</span>
          </Link>
          <Link to="/profile/orderhistory" className={getLinkClasses("/profile/orderhistory")}>
            <FaHistory className="text-yellow-400" />
            <span>Order History</span>
          </Link>
          <Link to="/profile/purchased-books" className={getLinkClasses("/profile/purchased-books")}>
            <FaBook className="text-yellow-400" />
            <span>Purchased Books</span>
          </Link>
          <Link to="/profile/settings" className={getLinkClasses("/profile/settings")}>
            <FaCog className="text-yellow-400" />
            <span>Settings</span>
          </Link>
        </nav>
      ) : (
        <nav className="flex flex-col w-full gap-4 text-zinc-300 items-center md:items-start">
          <Link to="/profile" className={getLinkClasses("/profile")}>
            <FaHistory className="text-yellow-400" />
            <span>All Orders</span>
          </Link>
          <Link to="/profile/add-promo" className={getLinkClasses("/profile/add-promo")}>
            <FaHeart className="text-yellow-400" />
            <span>Add Promo</span>
          </Link>
          <Link to="/profile/add-book" className={getLinkClasses("/profile/purchased-books")}>
            <FaBook className="text-yellow-400" />
            <span>Add New Book</span>
          </Link>
          <Link to="/profile/settings" className={getLinkClasses("/profile/settings")}>
            <FaCog className="text-yellow-400" />
            <span>Settings</span>
          </Link>
        </nav>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-10 flex items-center gap-3 bg-yellow-500 text-white py-2 px-5 rounded-full hover:bg-yellow-400 shadow-md transition duration-300"
      >
        Logout
        <FaSignOutAlt />
      </button>
    </div>
  );
}

export default Sidebar;
