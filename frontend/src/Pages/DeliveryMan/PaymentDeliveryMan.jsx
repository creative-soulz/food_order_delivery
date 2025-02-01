/** @format */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

const PaymentDeliveryMan = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Items per page

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage]);

  // Fetch payments assigned to the delivery man
  const fetchPayments = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("simple_token");
      const res = await axios.get(
        `http://localhost:8000/api/payments/?page=${
          page + 1
        }&page_size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPayments(res.data.results);
      setTotalPages(Math.ceil(res.data.count / pageSize));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setLoading(false);
    }
  };

  // Handle updating the payment status to "completed"
  const updatePaymentStatus = async (paymentId, status) => {
    const token = localStorage.getItem("simple_token");

    // Confirm the update using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to mark this payment as ${status}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `http://localhost:8000/api/payments/${paymentId}/`,
            { payment_status: status },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire("Updated!", "Payment status has been updated.", "success");
          fetchPayments(currentPage); // Refetch payments after update
        } catch (err) {
          Swal.fire("Error", "Failed to update payment status.", "error");
        }
      }
    });
  };

  return (
    <div className="payment-list-container h-full max-w-full">
      <div className="header bg-white flex justify-between gap-3 px-3 py-4 rounded-lg w-full mb-3">
        <h1 className="text-2xl font-bold">Payment List</h1>
      </div>

      <div className="bg-white rounded-lg h-auto overflow-x-auto">
        {loading ? (
          <p className="text-[#5651ab]">Loading payments...</p>
        ) : payments.length === 0 ? (
          <p className="text-[#5651ab]">No payments found.</p>
        ) : (
          <table className="min-w-full rounded-lg bg-white">
            <thead>
              <tr className="bg-[#5651ab] text-white">
                <th className="text-left py-3 px-4">User ID</th>
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Payment Method</th>
                <th className="text-left py-3 px-4">Payment Status</th>
                <th className="text-left py-3 rounded-tr-lg px-4">
                  Payment Date
                </th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.order} className="border-b">
                  <td className="py-3 px-4">{payment.user}</td>
                  <td className="py-3 px-4">{payment.order}</td>
                  <td className="py-3 px-4">{payment.amount}</td>
                  <td className="py-3 px-4">{payment.payment_method}</td>
                  <td className="py-3 px-4">{payment.payment_status}</td>
                  <td className="py-3 px-4">
                    {new Date(payment.payment_date).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {payment.payment_status !== "COMPLETED" ? (
                      <button
                        className="bg-[#5651ab] text-white px-3 py-1 rounded"
                        onClick={() =>
                          updatePaymentStatus(payment.id, "COMPLETED")
                        }>
                        Mark as Completed
                      </button>
                    ) : (
                      <span className="text-green-600 font-bold">
                        Completed
                      </span>
                    )}
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

export default PaymentDeliveryMan;
