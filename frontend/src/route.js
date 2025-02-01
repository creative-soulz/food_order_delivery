import { lazy } from "react";
// admin
const AdminDashboard = lazy(()=>import('./Pages/Admin/AdminDashboard'))
const CustomerList = lazy(()=>import('./Pages/Admin/CustomerList'))
const  DeliveryMan = lazy(()=>import('./Pages/Admin/DeliveryMan'))
const  AdminList = lazy(()=>import('./Pages/Admin/AdminList'))
const FoodList = lazy(()=>import('./Pages/Admin/FoodList'))
const OrderList = lazy(() => import("./Pages/Admin/OrderList"));
const PaymentList = lazy(() => import("./Pages/Admin/PaymentList"));



const FoodPage = lazy(()=>import('./Pages/Customer/FoodPage'))
const DeliveryManDashboard = lazy(()=>import('./Pages/DeliveryMan/PaymentDeliveryMan'))
const PaymentDeliveryMan = lazy(() =>
  import("./Pages/DeliveryMan/PaymentDeliveryMan")
);
const OrderForDeliveryMan = lazy(() =>
  import("./Pages/DeliveryMan/OrderForDeliveryMan")
);


const Profile = lazy(()=>import('./Pages/Profile'))
const OrderTrack = lazy(()=>import('./Pages/Customer/OrderTrack'))

const FoodCard = lazy(() => import("./component/FoodCard"));
const Cart = lazy(() => import("./Pages/Customer/Cart"));
const PaymentHistory = lazy(() => import("./Pages/Customer/PaymentHistory"));



export const adminRoute = [
  {
    path: "admin-dashboard/",
    name: "admin-dashboard",
    element: AdminDashboard,
  },
  // { path: "foodpage/", name: "foodpage", element: FoodPage },

  { path: "/profile", name: "profile", element: Profile },

  { path: "/customerlist", name: "profile", element: CustomerList },
  { path: "/deliverymanlist", name: "profile", element: DeliveryMan },
  { path: "/adminlist", name: "profile", element: AdminList },

  { path: "/food-list", name: "foodlist", element: FoodList },

  { path: "/order-list", name: "order-list", element: OrderList },
  { path: "/payment-list", name: "payment-list", element: PaymentList },
];

export const customerRoute = [
  { path: "foodpage/", name: "foodpage", element: FoodPage },
  { path: "/profile", name: "profile", element: Profile },
  { path: "test/", name: "FoodCard", element: FoodCard },
  { path: "/cart", name: "cart", element: Cart },
  { path: "/order-track", name: "order-track", element: OrderTrack },
  { path: "/payment-history", name: "payment-history", element: PaymentHistory },
];

export const deliveryManRoute = [
  {
    path: "deliveryman-dashboard/",
    name: "deliverymandashboard",
    element: DeliveryManDashboard,
  },
  { path: "/profile", name: "profile", element: Profile },
  {
    path: "/payment-deliveryman",
    name: "payment-deliveryman",
    element: PaymentDeliveryMan,
  },
  {
    path: "/order-deliveryman",
    name: "order-deliveryman",
    element: OrderForDeliveryMan,
  },
];