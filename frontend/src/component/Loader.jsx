import React from 'react'
// import { FiLoader } from "react-icons/fi";
import { BiLoaderCircle } from "react-icons/bi";
const Loader = () => {
  return (
    <div className="absolute z-50 top-0 left-0 h-full w-full bg-black bg-opacity-45 flex items-center justify-center ">
      <div className="animate-spin text-3xl">
        <BiLoaderCircle />
      </div>
    </div>
  );
}

export default Loader