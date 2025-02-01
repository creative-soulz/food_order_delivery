/** @format */

import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { jsPDF } from "jspdf";

const PaymentModel = ({
  cartItems,
  setCartItems,
  amount,
  setPaymentModelOpen,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const PAYMENT_METHOD_CHOICES = [
    { value: "COD", label: "Cash on Delivery" },
    { value: "BANK", label: "Bank Transfer" },
  ];

  const username = localStorage.getItem("username") || "Guest";
  const token = localStorage.getItem("simple_token");

  // Extract food item details from cartItems
  const foodItemsDetails = cartItems.map((item) => ({
    name: item.food_item_name,
    quantity: item.quantity,
    total_cost: item.total_cost,
  }));

  const generatePDF = (orderId, paymentStatus) => {
    const doc = new jsPDF();

    // Add title and basic information
    doc.setFontSize(18);
    doc.text("Invoice", 10, 10);
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 10, 20);
    doc.text(`Username: ${username}`, 10, 30);
    doc.text(`Total Amount: Rs.${amount}`, 10, 40);
    doc.text(`Payment Method: ${paymentMethod}`, 10, 50);

    // Add item details
    doc.text("Food Items:", 10, 60);
    doc.text(`Payment Status: ${paymentStatus}`, 10, 80);
    foodItemsDetails.forEach((item, index) => {
      const yPosition = 70 + index * 10;
      doc.text(
        `${item.name} (Qty: ${item.quantity}, Cost: Rs.${item.total_cost})`,
        10,
        yPosition
      );
    });

    // Save the PDF and trigger download
    doc.save(`invoice_${orderId}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = cartItems[0].user;

    try {
      const orderResponse = await axios.post(
        "http://localhost:8000/api/orders/",
        {
          items: cartItems,
          user: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const orderId = orderResponse.data.id;

      const paymentData = {
        user: userId,
        order: orderId,
        amount: amount,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "BANK" ? "COMPLETED" : "PENDING",
      };

      const paymentResponse = await axios.post(
        "http://localhost:8000/api/payments/",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res)=>{
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Payment successfully submitted!",
        });
        setPaymentModelOpen(false);
        setCartItems([]);

        // Generate and download the bill as a PDF
        {paymentData.payment_status == "COMPLETED" &&
          generatePDF(orderId, paymentData.payment_status);}}
       
      )
    } catch (error) {
      console.error("Error processing payment:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Payment submission failed. Please try again.",
      });
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center fixed top-0 left-0 bg-black bg-opacity-50">
      <div className="bg-white w-4/5 md:w-1/2 lg:w-1/3 shadow-2xl rounded-lg p-6 relative">
        <h1
          onClick={() => setPaymentModelOpen(false)}
          className="absolute cursor-pointer top-4 right-4 text-[#5651ab] text-2xl">
          <IoClose />
        </h1>
        <h2 className="text-xl font-semibold text-[#5651ab] mb-4">
          Complete Your Payment
        </h2>

        {/* Displaying username and food items */}
        <div className="mb-4">
          <p className="font-medium">
            Username: <span className="font-bold">{username}</span>
          </p>
          <h3 className="mt-2 font-medium">Food Items:</h3>
          <ul className="list-disc pl-5">
            {foodItemsDetails.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item.name} (Quantity: {item.quantity}, Total Cost: Rs.
                {item.total_cost})
              </li>
            ))}
          </ul>
        </div>

        {/* Displaying total amount */}
        <p className="font-medium text-lg">
          Total Amount: <span className="font-bold">Rs.{amount}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="paymentMethod"
              className="block mb-1 font-medium text-gray-700">
              Payment Method:
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-[#5651ab] focus:ring-[#5651ab]">
              {PAYMENT_METHOD_CHOICES.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5651ab] text-white p-2 rounded-md mt-4">
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModel;
