import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";
import App from "../App";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Products from "../pages/Products";
import StoreLocator from "../pages/StoreLocator";
import AdminProducts from "../pages/admin/AdminProducts";
import ProductForm from "../pages/admin/ProductForm";
import InventoryManagement from "../pages/admin/InventoryManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import UserManagement from "../pages/admin/UserManagement";

// Guest Routes
const guestRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Products /> },
			{path: "stores", element: <StoreLocator/>},
			{ path: "*", element: <Navigate to="/login" /> },
		],
	
	},
]);

// User Routes
const userRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "*", element: <Navigate to="/" /> },
		],
	},
]);

//Admin Routes
const adminRouter = createBrowserRouter([
	{
		path: "/",
		children: [
			{ index: true, element: <AdminDashboard /> },
			{ path: "products", element: <AdminProducts /> },
			{ path: "products/new", element: <ProductForm /> },
			{ path: "products/edit/:id", element: <ProductForm/> },
			{ path: "inventory", element: <InventoryManagement /> },
			{ path: "orders", element: <OrderManagement /> },
			{ path: "users", element: <UserManagement /> },
			{ path: "*", element: <Navigate to="/admin" /> },
		  ],
	  
	},
]);

export default function AppRouter() {
	const role = useUserStore((state) => state.role);
	const [router, setRouter] = useState(guestRouter);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (role === "admin") {
				setRouter(adminRouter);
			} else if (role === "user") {
				setRouter(userRouter);
			} else {
				setRouter(guestRouter);
			}
			setIsLoading(false);
		}, 100);

		return () => clearTimeout(timer);
	}, [role]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return <RouterProvider router={router} />;
}
