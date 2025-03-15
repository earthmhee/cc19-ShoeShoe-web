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
import HowtoOrder from "../pages/FooterPages/Howtoorder";
import Membership from "../pages/FooterPages/Membership";
import Policies from "../pages/FooterPages/Policies";
import Privacy from "../pages/FooterPages/Privacy";
import FAQS from "../pages/FooterPages/FAQS";
import ShippingPolicy from "../pages/FooterPages/ShippingPolicy";
import StatusTracking from "../pages/FooterPages/StatusTracking";
import AboutUs from "../pages/FooterPages/AboutUs";

import { ClerkLoaded, useAuth, useUser } from "@clerk/clerk-react";
import AccountInfo from "../pages/account/AccountInfo";
import AccountUpdate from "../pages/account/AccountUpdate";
import SubLayoutAccount from "../components/accountManage/subLayoutAccount";
import Addressbook from "../components/accountManage/Addressbook";

// Guest Routes
const guestRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Products /> },
			{ path: "/product/:id", element: <ProductDetail /> },
			{ path: "/login", element: <p>login</p> },
			{ path: "/register", element: <p>register</p> },

			//Footer Pages
			{ path: "/membership", element: <Membership /> },
			{ path: "/howtoorder", element: <HowtoOrder /> },
			{ path: "/policies", element: <Policies /> },
			{ path: "/privacy", element: <Privacy /> },
			{ path: "/faqs", element: <FAQS /> },
			{ path: "/shipping-policy", element: <ShippingPolicy /> },
			{ path: "/status-tracking", element: <StatusTracking /> },
			{ path: "/amlocator", element: <StoreLocator /> },
			{ path: "stores", element: <StoreLocator /> },
			{ path: "/about-us", element: <AboutUs /> },

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
			{
				path: "account", // children ของ account
				element: <SubLayoutAccount />,
				children: [
					{ index: true, element: <AccountInfo /> },
					{ path: "update", element: <AccountUpdate /> },
					{ path: "address", element: <Addressbook /> },
				],
			},
			{ path: "/product/:id", element: <ProductDetail /> },
			//Footer Pages
			{ path: "/membership", element: <Membership /> },
			{ path: "/howtoorder", element: <HowtoOrder /> },
			{ path: "/policies", element: <Policies /> },
			{ path: "/privacy", element: <Privacy /> },
			{ path: "/faqs", element: <FAQS /> },
			{ path: "/shipping-policy", element: <ShippingPolicy /> },
			{ path: "/status-tracking", element: <StatusTracking /> },
			{ path: "/amlocator", element: <StoreLocator /> },
			{ path: "stores", element: <StoreLocator /> },
			{ path: "/about-us", element: <AboutUs /> },
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
			{ path: "products/edit/:id", element: <ProductForm /> },
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
				console.log("Set State Complete");
				createAccount(token);
				console.log("Create Account Complete");
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
