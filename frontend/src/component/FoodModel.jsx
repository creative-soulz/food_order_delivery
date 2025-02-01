/** @format */

import Swal from "sweetalert2";
import React from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const FoodModel = ({
  setOpenFoodModel,
  openFoodModel,
  foodItem,
  setEditFoodItem,
}) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Food name is required"),
    url: Yup.string()
      .url("Must be a valid URL")
      .required("Image URL is required"),
    category: Yup.string()
      .oneOf(["veg", "non_veg"], "Invalid category")
      .required("Category is required"),
    price: Yup.number()
      .positive("Price must be a positive number")
      .required("Price is required"),
    description: Yup.string().required("Description is required"),
    available: Yup.boolean().required("Availability status is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  React.useEffect(() => {
    if (foodItem) {
      reset({
        name: foodItem.name,
        url: foodItem.url,
        category: foodItem.category,
        price: foodItem.price,
        description: foodItem.description,
        available: foodItem.available,
      });
    }
  }, [foodItem, reset]);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("simple_token");
    try {
      if (foodItem?.id) {
       
        await axios.put(
          `http://localhost:8000/api/food/${foodItem.id}/`,
          { ...data, id: foodItem.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Food item updated successfully!",
        });
      } else {
        // Create new food item
        await axios.post(`http://localhost:8000/api/food/`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Food item created successfully!",
        });
      }
      setOpenFoodModel(false);
      setEditFoodItem(null);
    } catch (error) {
      console.error("Error submitting form", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.detail ||
          "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="h-[86%] w-[95%] md:h-full top-24 left-2 md:top-0 absolute flex items-center justify-center">
      <div className="bg-white h-[105%] z-50 w-[90%] md:w-1/2 md:h-[89%] relative lg:w-1/3 shadow-2xl rounded-lg p-6">
        <h1
          onClick={() => setOpenFoodModel(!openFoodModel)}
          className="absolute cursor-pointer top-6 text-[#5651ab] right-6 text-3xl">
          <IoClose />
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-9">
          <div>
            <input
              type="text"
              placeholder="Food Name"
              {...register("name")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          <div>
            <input
              type="text"
              placeholder="Image URL"
              {...register("url")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]"
            />
            <p className="text-red-500 text-sm">{errors.url?.message}</p>
          </div>

          <div>
            <select
              {...register("category")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]">
              <option value="">Select Category</option>
              <option value="veg">Veg</option>
              <option value="non_veg">Non-Veg</option>
            </select>
            <p className="text-red-500 text-sm">{errors.category?.message}</p>
          </div>

          <div>
            <input
              type="number"
              placeholder="Price"
              {...register("price")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]"
            />
            <p className="text-red-500 text-sm">{errors.price?.message}</p>
          </div>

          <div>
            <textarea
              placeholder="Description"
              {...register("description")}
              className="mt-1 h-20 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]"
            />
            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
          </div>

          <div>
            <label className="block mb-2">Available:</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("available")}
                className="mr-2"
              />
              <span>Available</span>
            </div>
            <p className="text-red-500 text-sm">{errors.available?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5651ab] text-white p-2 rounded-md mt-4">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoodModel;
