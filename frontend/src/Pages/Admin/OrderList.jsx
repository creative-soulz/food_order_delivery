/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Items per page

  useEffect(() => {
    fetchOrders(currentPage);
    fetchDeliveryMen();
  }, [currentPage]);

  // Fetch orders from the track-delivery API
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

  // Fetch delivery men from the API
  const fetchDeliveryMen = async () => {
    try {
      const token = localStorage.getItem("simple_token");
      const res = await axios.get(
        `http://localhost:8000/api/users/?role=delivery_man&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeliveryMen(res.data.results);
    } catch (err) {
      console.error("Error fetching delivery men:", err);
    }
  };

  // Handle assigning a delivery man to an order
  const assignDeliveryMan = async (id, deliveryManId) => {
    try {
      const token = localStorage.getItem("simple_token");
      await axios.patch(
        `http://localhost:8000/api/track-delivery/${id}/`,
        { delivery_man: deliveryManId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders(currentPage); // Refetch orders after assignment
    } catch (err) {
      console.error("Error assigning delivery man:", err);
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
                <th className="text-left py-3 px-4">Payment Method</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3  px-4">
                  Delivery Date
                </th>
                <th className="text-left py-3 px-4">Assign Delivery Man</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order} className="border-b">
                  <td className="py-3 px-4">{order.order}</td>
                  <td className="py-3 px-4">{order.customer_username}</td>
                  <td className="py-3 px-4">{order.customer_address}</td>
                  <td className="py-3 px-4">
                    {order.payment_method === "cod"
                      ? "Cash on Delivery"
                      : "Bank"}
                  </td>
                  <td className="py-3 px-4">{order.status}</td>
                  <td className="py-3 px-4">{order.delivery_date || "N/A"}</td>
                  <td className="py-3 px-4">
                    <select
                      onChange={(e) =>
                        assignDeliveryMan(order.id, e.target.value)
                      }
                      defaultValue=""
                      className="p-2 border rounded">
                      <option value="" disabled>
                        {order.delivery_man
                          ? order.delivery_man
                          : "Select Delivery Man"}
                      </option>
                      {deliveryMen.map((man) => (
                        <option key={man.id} value={man.id}>
                          {man.username}
                        </option>
                      ))}
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

export default OrderList;
