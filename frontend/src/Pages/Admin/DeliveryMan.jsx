    /** @format */

    import React, { useState, useEffect } from "react";
    import { IoIosSearch } from "react-icons/io";
    import axios from "axios";
    import UserModel from "../../component/UserModel"; 
    import ReactPaginate from "react-paginate";
    import { FaRegEdit } from "react-icons/fa";
    import { MdDelete } from "react-icons/md";

    const DeliveryMan = () => {
    const [openUserModel, setOpenUserModel] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5);
    const [editCustomer, setEditCustomer] = useState(null);

    const token = localStorage.getItem("simple_token");

    const fetchCustomers = async (page = 1, search = "") => {
        setLoading(true);
        try {
        const response = await axios.get(
            `http://localhost:8000/api/users/?role=delivery_man&page=${page}&username=${search}`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );
        setCustomers(response.data.results);
        setTotalPages(Math.ceil(response.data.count / pageSize));
        } catch (error) {
        console.error("Error fetching user data", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers(currentPage + 1, searchQuery);
    }, [currentPage, searchQuery]);

    const handleSearch = () => {
        setCurrentPage(0);
        fetchCustomers(1, searchQuery);
    };

    const handlePageChange = (data) => {
        const selectedPage = data.selected;
        setCurrentPage(selectedPage);
    };

    const handleEdit = (customer) => {
        setEditCustomer(customer);
        setOpenUserModel(true); // Open modal for editing
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
        try {
            await axios.delete(`http://localhost:8000/api/users/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            fetchCustomers(currentPage + 1, searchQuery); // Refresh the list
        } catch (error) {
            console.error("Error deleting user", error);
        }
        }
    };

    return (
        <div className="flex h-full flex-col items-center justify-center">
        <div className="h-full flex items-center flex-col bg-white rounded-t-lg w-full shadow-lg">
            <div className="flex flex-col w-full p-4 rounded-t-lg bg-[#f9f9f9] shadow">
            <h1 className="text-center text-2xl font-semibold mb-4">Delivery Man</h1>
            <div className="flex-col lg:flex-row-reverse flex justify-between items-center">
                <div className="flex lg:w-1/4 gap-2">
                <input
                    type="text"
                    className="w-2/3 border h-full border-[#5651ab] text-center py-2 bg-[#deebf8] rounded-lg shadow-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by username"
                />
                <button
                    onClick={handleSearch}
                    className="w-1/3 flex justify-center items-center py-2 rounded-lg text-white bg-[#5651ab]">
                    Search
                    <div className="font-bold text-lg">
                    <IoIosSearch />
                    </div>
                </button>
                </div>
                <button
                onClick={() => {
                    setEditCustomer(null);
                    setOpenUserModel(true);
                }}
                className="bg-[#5651ab] text-white w-full lg:w-28 mt-3 px-4 py-2 rounded">
                Add User
                </button>
            </div>
            </div>

            <div className="w-full lg:w-1/4">
            {openUserModel && (
                <UserModel
                openUserModel={openUserModel}
                setOpenUserModel={setOpenUserModel}
                customer={editCustomer}
                setEditCustomer={setEditCustomer}
                />
            )}
            </div>

            {/* Table Section */}
            <div className="w-full  px-4 py-6 overflow-x-auto">
            {loading ? (
                <p>Loading User...</p>
            ) : customers.length > 0 ? (
                <table className="min-w-full table-auto bg-white">
                <thead>
                    <tr>
                    <th className="px-4 py-2 border">Username</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Address</th>
                    <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                    <tr key={customer.id}>
                        <td className="px-4 py-2 border">{customer.username}</td>
                        <td className="px-4 py-2 border">{customer.email}</td>
                        <td className="px-4 py-2 border">
                        {customer.phone_number}
                        </td>
                        <td className="px-4 py-2 border">{customer.address}</td>
                        <td className="px-4 py-2 border">
                        <button
                            onClick={() => handleEdit(customer)}
                            className="text-blue-600">
                            <FaRegEdit />
                        </button>
                        <button
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600 ml-2">
                            <MdDelete />
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <p>No User found</p>
            )}
            </div>

            {/* Pagination Section */}
        </div>
        <div className="flex justify-center   w-full  py-4 rounded-b-lg bg-[#f9f9f9] border-t">
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
            pageClassName={"page-item h-full"}
            pageLinkClassName={
                "page-link bg-[#5651ab] text-white h-full px-3 py-1 mx-1 rounded"
            }
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
            />
        </div>
        </div>
    );
    };

    export default DeliveryMan;
