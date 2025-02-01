/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2"; // Import SweetAlert2

const OrderForDeliveryMan = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Items per page

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  // Fetch orders assigned to the delivery man from the track-delivery API
  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("simple_token");
      const res = await axios.get(
        `http://localhost:8000/api/track-delivery/?page=${
          page + 1
        }&page_size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data.results);
      setTotalPages(Math.ceil(res.data.count / pageSize));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };
console.log(orders)
  // Handle updating the status of an order
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("simple_token");
      await axios.patch(
        `http://localhost:8000/api/track-delivery/${id}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders(currentPage); // Refetch orders after status update

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Order status has been updated to ${status}.`,
        timer: 2000,
      });
    } catch (err) {
      console.error("Error updating status:", err);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was a problem updating the status.",
      });
    }
  };

  return (
    <div className="order-list-container h-full max-w-full">
      {/* Top Div: Header */}
      <div className="header bg-white md:flex md:justify-between flex-col gap-3 px-3 py-4 rounded-lg w-full mb-3">
        <h1 className="text-2xl font-bold">Order Tracking</h1>
      </div>

      <div className="bg-white rounded-t-lg h-auto overflow-x-auto">
        {loading ? (
          <p className="text-[#5651ab]">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-[#5651ab]">No orders found.</p>
        ) : (
          <table className="min-w-full rounded-lg bg-white">
            <thead>
              <tr className="bg-[#5651ab] text-white">
                <th className="text-left py-3 rounded-tl-lg px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Address</th>
                
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Delivery Date</th>
                <th className="text-left py-3 px-4">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order} className="border-b">
                  <td className="py-3 px-4">{order.order}</td>
                  <td className="py-3 px-4">{order.customer_username}</td>
                  <td className="py-3 px-4">{order.customer_address}</td>
                 
                  <td className="py-3 px-4">{order.status}</td>
                  <td className="py-3 px-4">{order.delivery_date || "N/A"}</td>
                  <td className="py-3 px-4">
                    <select
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      defaultValue={order.status}
                      className="p-2 border rounded">
                      <option value="pending">Pending</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center w-full py-4 bg-[#f9f9f9] border-t rounded-b-lg">
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

export default OrderForDeliveryMan;
