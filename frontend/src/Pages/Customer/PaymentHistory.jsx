/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Items per page

  const fetchPaymentData = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("simple_token");
      const response = await axios.get(
        `http://localhost:8000/api/payments/?page=${
          page + 1
        }&page_size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPayments(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (err) {
      console.error("Error fetching payment data:", err);
      setError("Failed to fetch payment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData(currentPage);
  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="payment-history-container h-full max-w-full">
      {/* Top Div: Header */}
      <div className="header bg-white md:flex md:justify-between flex-col gap-3 px-3 py-4 rounded-lg w-full mb-3">
        <h1 className="text-2xl font-bold ">Payment History</h1>
      </div>

      <div className="bg-white rounded-t-lg h-auto overflow-x-auto">
        {payments.length === 0 ? (
          <p className="text-[#5651ab]">No payments found.</p>
        ) : (
          <table className="min-w-full rounded-lg bg-white">
            <thead>
              <tr className="bg-[#5651ab] text-white">
                <th className="text-left py-3 rounded-tl-lg px-4">User ID</th>
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Payment Method</th>
                <th className="text-left py-3 px-4">Payment Status</th>
                <th className="text-left py-3 px-4">Transaction ID</th>
                <th className="text-left py-3 rounded-tr-lg px-4">
                  Payment Date
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="py-3 px-4">{payment.user}</td>
                  <td className="py-3 px-4">{payment.order}</td>
                  <td className="py-3 px-4">₹{payment.amount}</td>
                  <td className="py-3 px-4">{payment.payment_method}</td>
                  <td className="py-3 px-4">{payment.payment_status}</td>
                  <td className="py-3 px-4">
                    {payment.transaction_id || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(payment.payment_date).toLocaleDateString()}
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

export default PaymentHistory;
