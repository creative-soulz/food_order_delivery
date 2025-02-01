/** @format */

import { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { BsFillBasket3Fill } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import the context
import axios from "axios"; // Import axios for API requests

const Header = () => {
  const navigate = useNavigate();
  const [opendrop, setopendrop] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); 
  const { getTotalItems } = useCart();
  const role = localStorage.getItem("role");

  // Fetch notification count for admin
  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("simple_token");
      const response = await axios.get(
        "http://localhost:8000/api/track-delivery/?page=1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter results for orders with null delivery_man
      const count = response.data.results.filter(
        (order) => order.delivery_man === null
      ).length;
      setNotificationCount(count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("simple_token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("address");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("phone_number");
    navigate("/");
  };

  // Fetch notification count on component mount and whenever the role changes
  useEffect(() => {
    if (role === "admin") {
      fetchNotificationCount();
    }
  }, [role]);

  return (
    <div className="w-full h-full flex items-center justify-between">
      <h1 className="mx-2 font-semibold">Food Delivery</h1>
      <div className="flex gap-3">
        {role === "customer" && (
          <div className="mr-2 relative cursor-pointer text-[#5651ab] border-2 text-xl border-[#5651ab] flex items-center justify-center rounded-full h-10 w-10">
            <Link to="/cart">
              <BsFillBasket3Fill />
            </Link>
            <h1 className="absolute text-sm bg-[#5651ab] h-5 w-5 rounded-full -top-1 -right-2 flex items-center justify-center text-white">
              {getTotalItems()}
            </h1>
          </div>
        )}
        {role === "admin" && (
          <div className="mr-2 relative cursor-pointer text-[#5651ab] border-2 text-xl border-[#5651ab] flex items-center justify-center rounded-full h-10 w-10">
            <Link to="/order-list">
              <IoIosNotifications />
            </Link>
            <h1 className="absolute text-sm bg-[#5651ab] h-5 w-5 rounded-full -top-1 -right-2 flex items-center justify-center text-white">
              {notificationCount} {/* Display the notification count */}
            </h1>
          </div>
        )}
        <div className="relative mr-2">
          <div
            onClick={() => setopendrop(!opendrop)}
            className="bg-[#5651ab] cursor-pointer text-white flex items-center justify-center rounded-full h-10 w-10">
            <FaRegUser />
          </div>
        </div>
      </div>
      {opendrop && (
        <div className="absolute right-0 top-14 h-[5rem] w-[7rem] lg:w-[9rem] items-center justify-evenly rounded-lg flex flex-col bg-[#5651ab]">
          <h1
            onClick={() => navigate("/profile")}
            className="text-white cursor-pointer">
            Profile
          </h1>
          <h1
            onClick={handleLogout}
            className="text-[#5651ab] bg-white cursor-pointer text-center rounded w-[80%]">
            Logout
          </h1>
        </div>
      )}
    </div>
  );
};

export default Header;
