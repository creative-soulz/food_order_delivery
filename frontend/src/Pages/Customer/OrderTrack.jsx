/** @format */
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2"; // Make sure to install sweetalert2

const OrderTrack = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Adjust as needed
  const username = localStorage.getItem("username");

  // Fetch orders from the API with pagination
  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("simple_token");
      const response = await axios.get(
        `http://localhost:8000/api/track-delivery/?page=${
          page + 1
        }&page_size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.results); // Save orders
      setTotalPages(Math.ceil(response.data.count / pageSize)); // Total pages based on count and page size
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel order with confirmation
  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("simple_token");

    // Confirmation dialog using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Send DELETE request to cancel the order
          await axios.delete(`http://localhost:8000/api/orders/${orderId}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire("Cancelled!", "Your order has been cancelled.", "success");

          // Refresh orders after cancellation
          fetchOrders(currentPage);
        } catch (error) {
          console.error("Error canceling order:", error);
          Swal.fire(
            "Error!",
            "There was a problem canceling your order.",
            "error"
          );
        }
      }
    });
  };

  // Fetch orders on component mount and when currentPage changes
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="order-track-container h-full max-w-full">
      {/* Top Div: Header */}
      <div className="header bg-white md:flex md:justify-between flex-col gap-3 px-3 py-4 rounded-lg w-full mb-3">
        <h1 className="text-2xl font-bold">Order Tracking</h1>
      </div>

      <div className="bg-white rounded-t-lg h-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            {" "}
            {/* Enable horizontal scrolling */}
            <table className="min-w-full rounded-lg bg-white">
              <thead>
                <tr className="w-full bg-[#5651ab] rounded-lg text-white">
                  <th className="text-left py-3 rounded-tl-lg px-4">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Username</th>
                  <th className="text-left py-3 rounded-tr-lg px-4">
                    Cancel Order
                  </th>{" "}
                  {/* New Column */}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 px-4">{order.order}</td>
                    <td className="py-3 px-4">{order.status}</td>
                    <td className="py-3 px-4">{username || "N/A"}</td>
                    <td className="py-3 px-4">
                      {order.status === "pending" && (
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleCancelOrder(order.order)}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default OrderTrack;
