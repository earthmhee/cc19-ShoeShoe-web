import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";
import App from "../App";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import StoreLocator from "../pages/StoreLocator";
import AdminProducts from "../pages/admin/AdminProducts";
import ProductForm from "../pages/admin/ProductForm";
import InventoryManagement from "../pages/admin/InventoryManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import UserManagement from "../pages/admin/UserManagement";

import { ClerkLoaded, useAuth, useUser } from "@clerk/clerk-react";
import AccountInfo from "../pages/account/AccountInfo";
import Dummydashboard from "../components/Dummydashboard";

// Guest Routes
const guestRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Products/> },
			{ path: "/product/:id", element: <ProductDetail /> },
			{ path: "/login", element: <p>login</p> },
			{ path: "/register", element: <p>register</p> },
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
