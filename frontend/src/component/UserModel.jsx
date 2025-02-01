/** @format */

import Swal from "sweetalert2";
/** @format */

import React from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const UserModel = ({
  setOpenUserModel,
  openUserModel,
  customer,
  setEditCustomer,
}) => {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone_number: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    role: Yup.string()
      .oneOf(["admin", "customer", "delivery_man"], "Invalid role")
      .required("Role is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // To reset the form after submission
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Effect to populate the form when editing a customer
  React.useEffect(() => {
    if (customer) {
      reset({
        username: customer.username,
        email: customer.email,
        phone_number: customer.phone_number,
        address: customer.address,
        role: customer.role,
        // Note: If you want to edit the password, consider handling it differently
        // If editing, don't show password as it's sensitive information
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("simple_token");
    try {
      if (customer?.id) {
        // Update existing customer
        await axios.put(
          `http://localhost:8000/api/users/${customer.id}/`,
          { ...data, id: customer.id }, // Send the customer ID with the data
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User updated successfully!",
        });
      } else {
        // Create new customer
        await axios.post(`http://localhost:8000/api/users/`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User created successfully!",
        });
      }
      setOpenUserModel(false); // Close modal after submission
      setEditCustomer(null); // Reset edit state
    } catch (error) {
      console.error("Error submitting form", error);
      // Display error message
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
          onClick={() => setOpenUserModel(!openUserModel)}
          className="absolute cursor-pointer top-6 text-[#5651ab] right-6 text-3xl">
          <IoClose />
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-9">
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]"
            />
            <p className="text-red-500 text-sm">{errors.username?.message}</p>
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <input
              type="text"
              placeholder="Phone Number"
              {...register("phone_number")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]"
            />
            <p className="text-red-500 text-sm">
              {errors.phone_number?.message}
            </p>
          </div>

          <div>
            <input
              type="text"
              placeholder="Address"
              {...register("address")}
              className="mt-1 h-20 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]"
            />
            <p className="text-red-500 text-sm">{errors.address?.message}</p>
          </div>

          <div>
            <select
              {...register("role")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]">
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="delivery_man">Delivery Man</option>
            </select>
            <p className="text-red-500 text-sm">{errors.role?.message}</p>
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

export default UserModel;
