import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";
import App from "../App";
import Home from "../pages/Home";
import AdminDashboard from "../pages/AdminDashboard";
import Products from "../pages/Products";
import StoreLocator from "../pages/StoreLocator";

import { ClerkLoaded, useAuth, useUser } from "@clerk/clerk-react";
import AccountInfo from "../pages/account/AccountInfo";
import Dummydashboard from "../components/Dummydashboard";

// Guest Routes
const guestRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Products /> },
			{ path: "stores", element: <StoreLocator /> },
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
			{ index: true, element: <Products /> },
			{ path: "account", element: <AccountInfo /> }, //เดี๋ยวต้องมี children ของ account ต่อ
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
	const { isLoaded, getToken, isSignedIn, userId } = useAuth();
	const { user } = useUser();
	const [router, setRouter] = useState(guestRouter);
	const [isLoading, setIsLoading] = useState(true);
	const {
		setRole,
		setToken,
		setUser,
		setClerkID,
		createAccount,
		role: userRole,
	} = useUserStore();

	useEffect(() => {
		const fetchRoleAndToken = async () => {
			if (isSignedIn && user) {
				const token = await getToken();
				const role = user.publicMetadata?.role || "Customer";
				const finalRouter = role === "Admin" ? adminRouter : userRouter;
				setRouter(finalRouter);
				setRole(role);
				setToken(token);
				setUser(user.fullName);
				setClerkID(userId);
				console.log('Set State Complete');
				createAccount(token)
				console.log('Create Account Complete');
			} else {
				setRouter(guestRouter);
				setRole(null);
				setToken(null);
				setUser(null);
				setClerkID(null);
			}
			setIsLoading(false);
		};

		if (isLoaded) {
			fetchRoleAndToken();
		}
	}, [isLoaded, isSignedIn, user, getToken]);

	
	// do this because of the CLERK is need some time to load
	if (!isLoaded || isLoading) {
		return <div>Loading...</div>;
	}
	
	return (
		<ClerkLoaded>
			<RouterProvider key={user?.id} router={router} />
		</ClerkLoaded>
	);
}
