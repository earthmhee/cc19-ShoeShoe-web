import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import AdminDashboard from "../pages/AdminDashboard";

// Guest Routes
const guestRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "login", element: <Login /> },
			{ path: "register", element: <Register /> },
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

// Admin Routes
const adminRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "admin", element: <AdminDashboard /> },
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
