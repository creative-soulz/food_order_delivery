/** @format */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
const Sidebar = () => {
  const role = localStorage.getItem("role");
  const [isUsersAccordionOpen, setIsUsersAccordionOpen] = useState(false);

  const toggleUsersAccordion = () => {
    setIsUsersAccordionOpen(!isUsersAccordionOpen);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-4">
      <h1 className="font-semibold text-lg md:text-xl text-white"> SIDEBAR </h1>

      {role === "admin" && (
        <div className="flex mt-4 flex-col w-full h-full justify-start gap-1">
          <div className="relative">
            <Link
              className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center"
              to="/admin-dashboard">
              DashBoard
            </Link>
            <div
              className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center justify-between cursor-pointer"
              onClick={toggleUsersAccordion}>
              <span>Users</span>
              <button className="ml-2  focus:outline-none">
                {isUsersAccordionOpen ? <FaAngleUp /> : <FaAngleDown />}
              </button>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isUsersAccordionOpen ? "max-h-40" : "max-h-0"
              }`}>
              <ul className="py-2">
                <li className="hover:bg-white text-white hover:text-black rounded-lg text-sm font-semibold">
                  <Link to="/adminlist" className="block px-6 py-2 ">
                    Admin
                  </Link>
                </li>
                <li className="hover:bg-white text-white hover:text-black rounded-lg text-sm font-semibold">
                  <Link to="/deliverymanlist" className="block px-6 py-2 ">
                    Delivery Man
                  </Link>
                </li>
                <li className="hover:bg-white text-white hover:text-black rounded-lg text-sm font-semibold">
                  <Link to="/customerlist" className="block px-6 py-2 ">
                    Customer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Link
            className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center"
            to="/food-list">
            Food
          </Link>
          <Link
            className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center"
            to="/order-list">
            Order
          </Link>

          <Link
            className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center"
            to="/payment-list">
            Payment Records
          </Link>
          
        </div>
      )}

      {role === "customer" && (
        <div className="flex mt-4 flex-col w-full h-full justify-start gap-1">
          <Link
            className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center"
            to="/foodpage">
            Food
          </Link>
          <Link
            className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center"
            to="/cart">
            Cart
          </Link>
          <Link
            className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center"
            to="/order-track">
            Order
          </Link>
          <Link
            className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center"
            to="/payment-history">
            Payment History
          </Link>
         
        </div>
      )}
      {role === "delivery_man" && (
        <div className="flex mt-4 flex-col w-full h-full justify-start gap-1">
          <Link
            className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center"
            to="/order-deliveryman">
            Order
          </Link>
          <Link
            className="text-start text-white hover:bg-white hover:text-black transition-all font-semibold h-10 flex px-2 rounded-lg items-center"
            to="/payment-deliveryman">
            Payment
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
