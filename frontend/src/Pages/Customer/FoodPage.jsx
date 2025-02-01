/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import FoodCard from "../../component/FoodCard";
import ReactPaginate from "react-paginate";
import female from "../../assets/female.png";

const FoodPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10; // Define page size if needed
  const token = localStorage.getItem("simple_token");

  const fetchFoods = async (page = 1, search = "", category = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/food/?page=${page}&available=True&name=${search}&category=${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFoods(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      console.error("Error fetching food data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFoods(page, search, category);
  }, [page, search, category]);

  const handlePageClick = (data) => {
    setPage(data.selected + 1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className="h-full w-full">
      {/* Search and Filter Section */}
      <div className="h-25 md:h-16 rounded-lg shadow-lg w-full bg-white my-3 flex flex-col md:flex-row items-center justify-between p-4 space-y-2 md:space-y-0 md:space-x-4">
        <div className="flex items-center w-full md:w-2/3">
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#5651ab]"
          />
          <button
            onClick={() => fetchFoods(1, search, category)}
            className="bg-[#5651ab] text-white px-4 py-2 rounded-r-lg hover:bg-[#453f9c] transition">
            Search
          </button>
        </div>

        <div className="w-full md:w-1/3">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5651ab]">
            <option value="">All Categories</option>
            <option value="veg">Veg</option>
            <option value="non_veg">Non-Veg</option>
          </select>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col  md:flex-row mt-3 h-[27rem] justify-between rounded-lg md:h-[16rem] bg-[#605cb4]">
        <div className="flex flex-col-reverse md:flex-row w-full items-center justify-center">
          {/* Left Side - Hero Text */}
          <div className="h-1/2 w-full md:h-full rounded-lg md:w-1/2 flex items-center justify-center p-8">
            <div className="text-center md:text-left">
              <h1 className="md:text-4xl text-lg lg:text-5xl font-bold text-white mb-4">
                Fast and Reliable Food Delivery
              </h1>
              <p className="text-gray-200 text-sm md:text-lg lg:text-sm mb-6">
                Order now and get delicious food delivered to your doorstep in
                no time!
              </p>
              <button className="bg-white text-[#5651ab] px-6 py-1 md:py-2 rounded-md hover:bg-[#453f9c] transition duration-300">
                Order Now
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="h-1/3 w-full md:h-full rounded-lg md:w-1/2 flex items-center justify-center">
            <img
              src={female}
              alt="Food Delivery"
              className="rounded-lg lg:w-[23rem] h-[12rem] md:w-full md:h-full"
            />
          </div>
        </div>
      </div>

      {/* Food Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {loading ? (
          <p>Loading...</p>
        ) : (
          foods.map((food) => <FoodCard key={food.id} food={food} />)
        )}
      </div>

      <div className="flex justify-center   w-full  py-4 rounded-lg bg-white shadow-lg mt-5 ">
        <ReactPaginate
          previousLabel={
            <button className="bg-[#5651ab] text-white px-3 py-1 rounded-l">
              Previous
            </button>
          }
          nextLabel={
            <button className="bg-[#5651ab] text-white px-3 py-1 rounded-r">
              next
            </button>
          }
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex"}
          pageClassName={"page-item h-full mt-1"}
          pageLinkClassName={
            "page-link bg-[#5651ab] text-white h-full px-3 py-1 mx-1 rounded"
          }
          previousClassName={"page-item"}
          previousLinkClassName={"page-link b"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link "}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default FoodPage;
