/** @format */

import React from "react";
import axios from "axios";
import { useCart } from "../context/CartContext"; // Adjust the import path
import Swal from "sweetalert2";

const FoodCard = ({ food }) => {
  const { url, name, price, description, id } = food;

  // Access the cart context
  const { updateCartItems, cartItems } = useCart();

  const addToCart = async () => {
    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("simple_token");

      const cartData = {
        food_item: id,
        quantity: 1,
        user: userId,
      };

      // Make the API call to add the item to the cart
      const response = await axios.post(
        "http://localhost:8000/api/cart/",
        cartData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Item added to cart:", response.data);

      // SweetAlert success notification
      Swal.fire({
        title: "Added to Cart",
        text: `${name} has been added to your cart successfully!`,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
      });

      // Update the local cart state
      const existingItemIndex = cartItems.findIndex((item) => item.id === id);
      if (existingItemIndex >= 0) {
        // Item already in cart, update quantity
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += 1;
        updateCartItems(updatedItems);
      } else {
        // Item not in cart, add new item
        updateCartItems([...cartItems, { id, quantity: 1 }]);
      }
    } catch (error) {
      console.error("Error adding item to cart", error);

      // SweetAlert error notification
      Swal.fire({
        title: "Error",
        text: "There was a problem adding the item to your cart. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="bg-white lg:w-full shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row items-start md:items-center p-4">
      {/* Image */}
      <div className="w-full lg:w-1/2 md:w-2/3 flex-shrink-0">
        <img
          src={url}
          alt={name}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="w-full lg:w-1/2 md:w-2/3 mt-4 md:mt-0 md:ml-6 flex flex-col justify-between">
        {/* Food Name and Price */}
        <div>
          <h2 className="text-xl font-semibold text-[#5651ab]">{name}</h2>
          <p className="text-gray-600 font-bold text-lg">₹{price}</p>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm mt-2">{description}</p>

        {/* Add to Cart Button */}
        <button
          className="mt-4 bg-[#5651ab] text-white px-4 py-2 rounded-md hover:bg-[#453f9c] transition"
          onClick={addToCart} // Call the addToCart function when clicked
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
