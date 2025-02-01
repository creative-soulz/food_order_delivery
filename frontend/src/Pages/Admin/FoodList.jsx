/** @format */

import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import ReactPaginate from "react-paginate";
import FoodModel from "../../component/FoodModel"; 
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";



const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);
  const [isVeg, setIsVeg] = useState(true);
  const [openFoodModel, setOpenFoodModel] = useState(false); 
  const [editFoodItem, setEditFoodItem] = useState(null); 
  const token = localStorage.getItem("simple_token");
  

  const fetchFoods = async (page = 1, search = "", veg = true) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/food/?page=${page}&search=${search}&category=${
          veg ? "veg" : "non_veg"
        }`,
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

  const handleRemove = async (foodId) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await axios.delete(`http://localhost:8000/api/food/${foodId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchFoods(currentPage + 1, searchQuery, isVeg); 
      } catch (error) {
        console.error("Error removing food item", error);
      }
    }
  };

  useEffect(() => {
    fetchFoods(currentPage + 1, searchQuery, isVeg);
  }, [currentPage, searchQuery, isVeg]);

  const handleSearch = () => {
    setCurrentPage(0);
    fetchFoods(1, searchQuery, isVeg);
  };

  const handlePageChange = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="h-full flex items-center flex-col bg-white rounded-t-lg w-full shadow-lg">
        <div className="flex flex-col w-full p-4 rounded-t-lg bg-[#f9f9f9] shadow">
          <h1 className="text-center text-2xl font-semibold mb-4">Food List</h1>
          <div className="flex flex-col lg:flex-row-reverse justify-between items-center">
            <div className="flex lg:w-1/4 gap-2">
              <input
                type="text"
                className="w-2/3 border h-full border-[#5651ab] text-center py-2 bg-[#deebf8] rounded-lg shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by food name"
              />
              <button
                onClick={handleSearch}
                className="w-1/3 flex justify-center items-center py-2 rounded-lg text-white bg-[#5651ab]">
                Search
                <div className="font-bold text-lg">
                  <IoIosSearch />
                </div>
              </button>
            </div>
            <div className="flex  lg:flex-row gap-4   h-full items-center font-semibold mt-3">
              <label className="mr-2">Show:</label>
              <select
                value={isVeg ? "veg" : "non_veg"}
                onChange={(e) => setIsVeg(e.target.value === "veg")}
                className="border h-10 border-[#5651ab] py-2 bg-[#deebf8] rounded-lg shadow-md">
                <option value="veg">Veg</option>
                <option value="non_veg">Non-Veg</option>
              </select>
              <button
                onClick={() => {
                  setEditFoodItem(null); 
                  setOpenFoodModel(true); 
                }}
                className="bg-[#5651ab]  text-white w-full lg:w-28  mt-0  px-4 py-2 rounded">
                Add Food
              </button>
            </div>
          </div>
        </div>

        <div className="w-full px-4 py-6 overflow-x-auto">
          {loading ? (
            <p>Loading Food...</p>
          ) : foods.length > 0 ? (
            <table className="min-w-full table-auto bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Available</th>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border">Image</th>
                  <th className="px-4 py-2 border">Actions</th>{" "}
                  
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food.id}>
                    <td className="px-4 py-2 border">{food.name}</td>
                    <td className="px-4 py-2 border">{food.description}</td>
                    <td className="px-4 py-2 border">{food.price}</td>
                    <td className="px-4 py-2 border">
                      {food.available ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 border">{food.category}</td>
                    <td className="px-4 py-2 border">
                      <img
                        src={food.url}
                        alt={food.name}
                        className="w-16 h-16"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => {
                          setEditFoodItem(food); 
                          setOpenFoodModel(true); // 
                        }}>
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleRemove(food.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No food found</p>
          )}
        </div>

        {/* Pagination Section */}
      </div>
      <div className="flex justify-center w-full  bottom-2 py-4 rounded-b-lg bg-[#f9f9f9] border-t">
        <ReactPaginate
          previousLabel={
            <button className="bg-[#5651ab] text-white px-3 py-1 rounded-l">
              Previous
            </button>
          }
          nextLabel={
            <button className="bg-[#5651ab] text-white px-3 py-1 rounded-r">
              Next
            </button>
          }
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex"}
          pageClassName={"page-item mt-1"}
          pageLinkClassName={
            "page-link bg-[#5651ab] text-white px-3 py-1 mx-2 rounded"
          }
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={""}
          disabledClassName={"bg-gray-400"}
        />
      </div>
      {openFoodModel && (
        <FoodModel
          openFoodModel={openFoodModel}
          setOpenFoodModel={setOpenFoodModel}
          foodItem={editFoodItem}
          setEditFoodItem={setEditFoodItem} 
        />
      )}
    </div>
  );
};

export default FoodList;
