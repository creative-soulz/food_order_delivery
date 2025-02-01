/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { useCart } from "../../context/CartContext";
import { MdDelete } from "react-icons/md";
import PaymentModel from "../../component/PaymentModel"; // Adjust the import path as necessary

const Cart = () => {
  const { updateCartItems } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPaymentModelOpen, setPaymentModelOpen] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("id")); // Assume you store userId in localStorage
  const [orderId, setOrderId] = useState(null);
  const [amount, setAmount] = useState(0);
  const pageSize = 10;


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("simple_token");
        const response = await axios.get(
          `http://localhost:8000/api/cart/?page=${
            currentPage + 1
          }&page_size=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const items = response.data.results || [];
        setCartItems(items);
        updateCartItems(items);
        setTotalPages(Math.ceil(response.data.count / pageSize));
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to fetch cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [currentPage]);

  // Function to calculate total cost
  const calculateTotalCost = () => {
    return cartItems.reduce((acc, item) => acc + Number(item.total_cost), 0);
  };


const removeItem = async (itemId) => {
    const token = localStorage.getItem("simple_token");
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/cart/${itemId}/`, {
          headers: {
            Authorization:` Bearer ${token}`,
          },
        });
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
        updateCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      } catch (error) {
        console.error("Error removing item:", error);
        setError("Failed to remove item.");
      }
    }
  };


  const updateQuantity = async (itemId, quantity) => {
    const token = localStorage.getItem("simple_token");
    const itemToUpdate = cartItems.find((item) => item.id === itemId);

    if (itemToUpdate) {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }

      try {
        const response = await axios.put(
          `http://localhost:8000/api/cart/${itemId}/`,
          {
            user: itemToUpdate.user,
            food_item: itemToUpdate.food_item,
            quantity,
          },
          {
            headers: {
              Authorization:` Bearer ${token}`,
            },
          }
        );

        const updatedItem = response.data;
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? { ...item, quantity, total_cost: updatedItem.total_cost }
              : item
          )
        );
        updateCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? { ...item, quantity, total_cost: updatedItem.total_cost }
              : item
          )
        );
      } catch (error) {
        console.error("Error updating quantity:", error);
        setError("Failed to update quantity.");
      }
    }
  };



  
  const handleConfirmOrder = async () => {
    const totalCost = calculateTotalCost(); // Get the total cost

    const result = await Swal.fire({
      title: "Confirm Order",
      text: "Do you want to proceed with the order?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    });

    if (result.isConfirmed) {
      setOrderId(null); // Set orderId to null initially
      setAmount(totalCost); // Set amount to total cost
      setPaymentModelOpen(true); // Open payment model
    }
  };

  const handlePaymentSuccess = () => {
    Swal.fire(
      "Order Confirmed!",
      "Your order has been placed successfully.",
      "success"
    );
    setCartItems([]);
    updateCartItems([]);
    setPaymentModelOpen(false); // Close payment model
  };

  // Render loading, error, and cart items
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  
  return (
    <div className="cart-container h-full  max-w-full">
      {/* Top Div: Total Cost */}
      <div className="total-cost bg-white md:flex md:flex-row md:justify-between flex flex-col gap-3 px-3 py-4 rounded-lg w-full mb-3">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <h1 className="text-xl font-semibold">
          TOTAL COST: ₹{calculateTotalCost()}
        </h1>
        <button
          onClick={handleConfirmOrder}
          className="bg-[#5651ab] text-white px-4 py-2 rounded-md mb-4">
          Confirm Order
        </button>
      </div>

      <div className="px-2 bg-white rounded-t-lg h-auto">
        <div className="cart-items bg-white rounded-lg">
          {cartItems.length === 0 ? (
            <p className="text-[#5651ab]">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="cart-item border-b p-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex-1 text-center md:flex">
                  <h2 className="text-xl font-semibold">
                    {item.food_item_name}
                  </h2>
                  <p className="text-gray-600 md:mt-1 md:mx-3">
                    Price: ₹{item.total_cost}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="bg-[#5651ab] text-white px-2 py-1 rounded-l-md mr-2">
                    -
                  </button>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-[#5651ab] text-white px-2 py-1 rounded-r-md ml-2">
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 md:mx-2 text-white px-4 py-2 rounded-md mt-2 md:mt-0">
                  <MdDelete />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Model */}
      {isPaymentModelOpen && (
        <PaymentModel
          cartItems={cartItems}
          setCartItems={setCartItems}
          amount={amount}
          onPaymentSuccess={handlePaymentSuccess}
          setPaymentModelOpen={setPaymentModelOpen}
        />
      )}

      {/* Pagination logic */}
      <div className="flex justify-center w-full bottom-2 py-4 rounded-b-lg bg-[#f9f9f9] border-t">
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
          onPageChange={(data) => setCurrentPage(data.selected)}
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
    </div>
  );
};

export default Cart;
