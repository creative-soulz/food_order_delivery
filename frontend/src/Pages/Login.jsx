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
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema), // Use Yup for validation
  });

  // Function to handle form submission
const onSubmit = async (data) => {
  try {
    const res = await axios.post("http://localhost:8000/api/token/", data);

    // Store the token and user information in localStorage
    localStorage.setItem("simple_token", res.data.access);
    localStorage.setItem("id", res.data.id);
    localStorage.setItem("address", res.data.address);
    localStorage.setItem("phone_number", res.data.phone_number);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("role", res.data.role);
    navigateBasedOnRole(res.data.role);
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    swal.fire({
      icon: "error",
      title: "Login failed",
      text: "Invalid username or password",
    });
  }
};


  const navigateBasedOnRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "delivery_man":
        navigate("/deliveryman-dashboard");
        break;
      case "customer":
        navigate("/foodpage");
        break;
      default:
        swal.fire({
          icon: "warning",
          title: "Unknown role",
          text: "You do not have access to any dashboard",
        });
    }
  };

  return (
    <div className="h-[100vh] w-full flex items-center justify-center bg-[#dfebfb]">
      <div className="h-2/3 w-11/12 bg-white rounded-3xl shadow-lg md:w-6/12 lg:w-4/12">
        <h1 className="text-3xl font-semibold mt-5 lg:mt-8 text-center">
          Login
        </h1>
        <form
          className="flex-col justify-center px-3 items-center flex"
          onSubmit={handleSubmit(onSubmit)}>
          <input
            className={`bg-[#dfebfb] w-full text-center rounded mt-7 lg:mt-10 px-full py-2 border-2 ${
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
            className={`bg-[#dfebfb] w-full text-center mt-7 lg:mt-8 rounded px-full py-2 border-2 ${
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
            className="py-3 w-full rounded mt-7 lg:mt-7 transition-all hover:bg-[#3c3977] bg-[#5651ab] text-white">
            LOGIN
          </button>
          <p className="mt-3 text-slate-800">
            Don't have an account?{" "}
            <Link className="text-[#5651ab]" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
