/** @format */

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert2";

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.number()
    .typeError("Phone number must be a number")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Register = () => {
  const navigate = useNavigate();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema), // Use Yup for validation
  });

  // Function to handle form submission
  const onSubmit = (data) => {
    axios
      .post("http://localhost:8000/api/users/", data)
      .then((res) => {
        swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created successfully!",
        });
        navigate("/"); 
      })
      .catch((err) => {
        swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: err || "Something went wrong",
        });
      });
  };

  return (
    <div className="h-[100vh] w-full flex items-center justify-center bg-[#dfebfb]">
      <div className="h-auto overflow-y-auto w-11/12 bg-white rounded-3xl shadow-lg my-3 p-3 md:w-6/12 lg:w-4/12">
        <h1 className="text-3xl font-semibold mt-5 text-center">Register</h1>
        <form
          className="flex-col justify-center px-3 items-center flex"
          onSubmit={handleSubmit(onSubmit)}>
          <input
            className={`bg-[#dfebfb] w-full text-center rounded mt-5 px-full py-2 border-2 ${
              errors.username ? "border-red-500" : "border-transparent"
            } focus:border-[#5651ab] outline-none`}
            type="text"
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 mt-1">{errors.username.message}</p>
          )}

          <input
            className={`bg-[#dfebfb] w-full text-center rounded mt-5 px-full py-2 border-2 ${
              errors.email ? "border-red-500" : "border-transparent"
            } focus:border-[#5651ab] outline-none`}
            type="text"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 mt-1">{errors.email.message}</p>
          )}

          <input
            className={`bg-[#dfebfb] w-full text-center rounded mt-5 px-full py-2 border-2 ${
              errors.phone_number ? "border-red-500" : "border-transparent"
            } focus:border-[#5651ab] outline-none`}
            type="text"
            placeholder="Phone Number"
            {...register("phone_number")}
          />
          {errors.phone_number && (
            <p className="text-red-500 mt-1">{errors.phone_number.message}</p>
          )}

          <input
            className={`bg-[#dfebfb] w-full text-center rounded mt-5 px-full py-2 border-2 ${
              errors.address ? "border-red-500" : "border-transparent"
            } focus:border-[#5651ab] outline-none`}
            type="text"
            placeholder="Address"
            {...register("address")}
          />
          {errors.address && (
            <p className="text-red-500 mt-1">{errors.address.message}</p>
          )}

          <input
            className={`bg-[#dfebfb] w-full text-center rounded mt-5 px-full py-2 border-2 ${
              errors.password ? "border-red-500" : "border-transparent"
            } focus:border-[#5651ab] outline-none`}
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="py-3 w-full rounded mt-7 transition-all hover:bg-[#3c3977] bg-[#5651ab] text-white">
            REGISTER
          </button>
          <p className="mt-3 text-slate-800">
            Already have an account?{" "}
            <Link className="text-[#5651ab]" to="/">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
