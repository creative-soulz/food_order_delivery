/** @format */

import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // Using FontAwesome icon for toggle button
import { Suspense } from "react";
import Loader from "../component/Loader";
const DefaultLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen  flex flex-col">
      <header className="fixed rounded-xl shadow-md top-0 left-0 w-[93%] md:w-[97%] lg:w-[98%] h-16 m-3 bg-white z-10 flex items-center justify-start px-4">
        <button
          className=" text-[#5651ab] focus:outline-none"
          onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>

        <Header />
      </header>

      {/* Layout with Sidebar and Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sliding Sidebar */}
        <aside
          className={`fixed rounded-xl top-20  left-0 h-[85%] lg:h-[88%] bg-[#5c58af] transform ${
            isSidebarOpen ? "translate-x-4 " : "-translate-x-full"
          } transition-transform duration-300 ease-in-out w-56 md:w-64 z-20`}>
          <Sidebar />
        </aside>

        {/* Scrollable Content Area */}
         <Suspense fallback={<Loader></Loader>}>
        <main onClick={()=>setIsSidebarOpen(false)}
          className={`w-full mt-1 h-full  p-4 transition-all duration-300`}>
          <Outlet />
        </main>
            </Suspense>
      </div>
    </div>
  );
};

export default DefaultLayout;
