/** @format */

import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const username = localStorage.getItem("username");
  const [totalUsers, setTotalUsers] = useState(0);
  const [customerUsers, setCustomerUsers] = useState(0);
  const [deliveryMen, setDeliveryMen] = useState(0);
  const [adminUsers, setAdminUsers] = useState(0);

  const [totalFood, setTotalFood] = useState(0);
  const [availableFood, setAvailableFood] = useState(0);
  const [unavailableFood, setUnavailableFood] = useState(0);
  const [vegetarianFood, setVegetarianFood] = useState(0);
  const [nonVegetarianFood, setNonVegetarianFood] = useState(0);

  const [orderStats, setOrderStats] = useState({
    total_orders: 0,
    total_orders_last_7_days: 0,
    pending_orders: 0,
    canceled_orders: 0,
    delivered_orders: 0,
  });

  const [paymentStats, setPaymentStats] = useState({
    total_payments_amount: 0,
    payments_last_7_days_amount: 0,
    pending_payments_amount: 0,
    completed_payments_amount: 0,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("simple_token");
        const response = await axios.get(
          `http://localhost:8000/api/users/stats/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { total_users, customer_users, delivery_men, admin_users } =
          response.data;
        setTotalUsers(total_users);
        setCustomerUsers(customer_users);
        setDeliveryMen(delivery_men);
        setAdminUsers(admin_users);
      } catch (error) {
        console.error("Error fetching user statistics:", error);
      }
    };

    const fetchFoodStats = async () => {
      try {
        const token = localStorage.getItem("simple_token");
        const response = await axios.get(
          `http://localhost:8000/api/food/stats/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const {
          total_foods,
          available_foods,
          unavailable_foods,
          vegetarian_foods,
          non_vegetarian_foods,
        } = response.data;
        setTotalFood(total_foods);
        setAvailableFood(available_foods);
        setUnavailableFood(unavailable_foods);
        setVegetarianFood(vegetarian_foods);
        setNonVegetarianFood(non_vegetarian_foods);
      } catch (error) {
        console.error("Error fetching food statistics:", error);
      }
    };

    const fetchOrderStats = async () => {
      try {
        const token = localStorage.getItem("simple_token");
        const response = await axios.get(
          `http://localhost:8000/api/track-delivery/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrderStats(response.data);
      } catch (error) {
        console.error("Error fetching order statistics:", error);
      }
    };

    const fetchPaymentStats = async () => {
      try {
        const token = localStorage.getItem("simple_token");
        const response = await axios.get(
          `http://localhost:8000/api/payments/stats/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPaymentStats(response.data);
      } catch (error) {
        console.error("Error fetching payment statistics:", error);
      }
    };

    fetchUserStats();
    fetchFoodStats();
    fetchOrderStats();
    fetchPaymentStats();
  }, []);

  const pieData = {
    labels: ["Available", "Unavailable"],
    datasets: [
      {
        data: [availableFood, unavailableFood],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverBackgroundColor: ["#66BB6A", "#EF5350"],
      },
    ],
  };

  return (
    <div className="h-full w-full p-4">
      <div className="flex flex-col md:flex-row mt-3 h-[7rem] justify-between rounded-lg md:h-[8rem] bg-[#605cb4]">
        <div className="flex flex-col-reverse md:flex-row w-full items-center justify-center">
          <div className="h-1/2 w-full md:h-full rounded-lg flex items-center justify-center">
            <div className="text-center w-full">
              <h1 className="md:text-4xl text-xl lg:text-5xl font-bold text-white mb-4">
                Good Day, {username}
              </h1>
              <p className="text-gray-200 text-sm md:text-lg lg:text-sm mb-6">
                Have a nice day with FoodDelivery
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* User Stats */}
        <div className="p-6 bg-white rounded-lg shadow-lg text-blue-500 h-48 flex flex-col justify-between">
          <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center">
            <span className="material-icons text-blue-500 mr-2">insights</span>{" "}
            Users
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Total Users</span>
              <span className="text-2xl font-semibold text-blue-600">
                {totalUsers}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Customer Users</span>
              <span className="text-2xl font-semibold text-blue-600">
                {customerUsers}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Delivery Men</span>
              <span className="text-2xl font-semibold text-blue-600">
                {deliveryMen}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Admin Users</span>
              <span className="text-2xl font-semibold text-blue-600">
                {adminUsers}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg text-white h-48 flex flex-col justify-between">
          <h2 className="text-lg font-bold mb-2 text-black">Food Stats</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Food</span>
              <span className="text-2xl text-red-500 font-semibold">
                {totalFood}
              </span>
            </div>
            <div className="flex flex-col text-gray-500">
              <span className="text-sm">Vegetarian</span>
              <span className="text-2xl text-red-500 font-semibold">
                {vegetarianFood}
              </span>
            </div>
            <div className="flex flex-col text-gray-500">
              <span className="text-sm">Non-Vegetarian</span>
              <span className="text-2xl text-red-500 font-semibold">
                {nonVegetarianFood}
              </span>
            </div>
          </div>
        </div>

        {/* Food Statistics with Pie Chart */}
        <div className="p-6 bg-white rounded-lg shadow-lg text-blue-500 h-full flex flex-col justify-between">
          <h2 className="text-lg font-bold text-gray-700 text-center md:text-left">
            Food Availability
          </h2>
          <div className="flex-grow flex justify-center w-full h-[6rem] items-center">
            <Pie data={pieData} />
          </div>
          <div className="flex justify-around">
            <span className="text-sm text-gray-500">
              Available: {availableFood}
            </span>
            <span className="text-sm text-gray-500">
              Unavailable: {unavailableFood}
            </span>
          </div>
        </div>
      </div>

      {/* Third Section: Order Stats and Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Order Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-auto md:h-full">
          <h2 className="text-xl font-semibold mb-4 tracking-wide text-center text-gray-800">
            Order Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-sm text-gray-600">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold text-blue-500">
                {orderStats.total_orders}
              </h3>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-600">
                Orders Last 7 Days
              </p>
              <h3 className="text-2xl font-bold text-blue-500">
                {orderStats.total_orders_last_7_days}
              </h3>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-600">
                Pending Orders
              </p>
              <h3 className="text-2xl font-bold text-yellow-500">
                {orderStats.pending_orders}
              </h3>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-600">
                Delivered Orders
              </p>
              <h3 className="text-2xl font-bold text-green-500">
                {orderStats.delivered_orders}
              </h3>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-600">
                Canceled Orders
              </p>
              <h3 className="text-2xl font-bold text-red-500">
                {orderStats.canceled_orders}
              </h3>
            </div>
          </div>
        </div>

        {/* Payment Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-auto md:h-full">
          <h2 className="text-xl font-semibold mb-4 tracking-wide text-center text-gray-800">
            Payment Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-sm text-gray-600">
                Total Payments
              </p>
              <h3 className="text-2xl font-bold text-blue-500">
                Rs.{paymentStats.total_payments_amount}
              </h3>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-600">
                Payments Last 7 Days
              </p>
              <h3 className="text-2xl font-bold text-blue-500">
                Rs.{paymentStats.payments_last_7_days_amount}
              </h3>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-600">
                Pending Payments
              </p>
              <h3 className="text-2xl font-bold text-yellow-500">
                Rs.{paymentStats.pending_payments_amount}
              </h3>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-600">
                Completed Payments
              </p>
              <h3 className="text-2xl font-bold text-green-500">
                Rs.{paymentStats.completed_payments_amount}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
