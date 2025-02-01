/** @format */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import login_img from "../assets/login_img.jpg";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";

// Yup schema for form validation
const schema = yup.object().shape({
  username: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must be digits")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const token = localStorage.getItem("simple_token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const userData = response.data.results[0];
        setProfileData(userData);

        reset({
          username: userData.username,
          email: userData.email,
          phone_number: userData.phone_number,
          address: userData.address, // Set initial address value
        });
      })
      .catch((error) => {
        console.error("Error fetching profile data", error);
      });
  }, [token, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/users/${profileData.id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile updated successfully", response.data);
      setIsEditing(false);
      setProfileData(data); 
      Swal.fire({
        icon:"success",
        title:"Success",
        text:"sucesfully updated"
      })
    } catch (error) {
      Swal.fire({
        icon:"error",
        title:"Error",
        text:"Error updating profile"
      })
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start lg:flex-row lg:gap-3 mt-3">
      {/* Image Section */}
      <div className="hidden lg:block w-2/4">
        <div className="flex h-full justify-between gap-2 flex-col">
          <img
            src={login_img}
            alt="Profile"
            className="w-full h-1/2 object-fill  shadow-md rounded-lg"
          />
          <div className=" flex items-center justify-center h-[13rem] w-full">
            <div className="h-[90%] w-full  flex flex-col items-center justify-center rounded-lg shadow-lg bg-white p-4">
              <h3 className="text-xl text-[#5651ab] font-semibold mb-2">
                Profile Page Information
              </h3>
              <p className="text-gray-600">
                 You can view and update your personal information
                
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 h-full bg-white py-5 flex flex-col items-center justify-center lg:h-[37rem] rounded-lg shadow-lg lg:w-2/3">
        <div className="text-[#5651ab] mb-3 text-[6rem]">
          <FaUserCircle />
        </div>
        <h2 className="text-2xl font-bold mb-3">Profile</h2>
        {isEditing ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" lg:w-[60%] space-y-4">
            <div className="flex w-full ">
              <label className="block w-1/4 font-semibold">Name</label>
              <input
                type="text"
                {...register("username")}
                className={`w-full border p-2  rounded ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block w-1/4 font-semibold">Email</label>
              <input
                type="email"
                {...register("email")}
                className={`w-full border p-2 rounded ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block w-1/4 font-semibold">Phone</label>
              <input
                type="text"
                {...register("phone_number")}
                className={`w-full border p-2 rounded ${
                  errors.phone_number ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone_number && (
                <p className="text-red-500">{errors.phone_number.message}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block w-1/4 font-semibold">Address</label>
              <input
                type="text"
                {...register("address")}
                className={`w-full border p-2 rounded ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block w-1/4 font-semibold">Password</label>
              <input
                type="password"
                {...register("password")}
                className={`w-full border p-2 rounded ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className=" w-full flex gap-2 text-white px-4 py-2 rounded">
              <button
                type="submit"
                className="bg-[#5651ab] h-full w-1/2 py-1 rounded">
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-[#ec5656] h-full w-1/2 py-1 rounded">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          profileData && (
            <div className="space-y-4 px-3">
              <div className="flex gap-2">
                <p className="font-semibold">Name:</p>
                <p>{profileData.username}</p>
              </div>

              <div className="flex gap-2">
                <p className="font-semibold">Email:</p>
                <p>{profileData.email}</p>
              </div>

              <div className="flex gap-2">
                <p className="font-semibold">Phone:</p>
                <p>{profileData.phone_number}</p>
              </div>

              <div className="flex gap-2">
                <p className="font-semibold">Address:</p>
                <p>{profileData.address}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#5651ab] w-full text-white px-4 py-2 rounded">
                Edit Profile
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;
