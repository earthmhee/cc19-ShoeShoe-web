import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import useUserStore from "../stores/userStore";
import App from "../App";
import Products from "../pages/Products";
import HowtoOrder from "../pages/FooterPages/Howtoorder";
import Membership from "../pages/FooterPages/Membership";
import Policies from "../pages/FooterPages/Policies";
import Privacy from "../pages/FooterPages/Privacy";
import FAQS from "../pages/FooterPages/FAQS";
import ShippingPolicy from "../pages/FooterPages/ShippingPolicy";
import StatusTracking from "../pages/FooterPages/StatusTracking";
import AboutUs from "../pages/FooterPages/AboutUs";

const guestRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Products /> },
			{ path: "/login", element: <p>login</p> },
			{ path: "/register", element: <p>register</p> },

			// Footter
			{ path: "/membership", element: <Membership /> },
			{ path: "/howtoorder", element: <HowtoOrder /> },
			{ path: "/policies", element: <Policies /> },
			{ path: "/privacy", element: <Privacy /> },
			{ path: "/faqs", element: <FAQS /> },
			{ path: "/shipping-policy", element: <ShippingPolicy /> },
			{ path: "/status-tracking", element: <StatusTracking /> },
			
			{ path: "/about-us", element: <AboutUs /> },


			{ path: "*", element: <Navigate to="/login" /> },

		],
	},
]);

export default function AppRouter() {
	const user = useUserStore((state) => state.user);
	const finalRouter = guestRouter

	return <RouterProvider key={user?.id} router={finalRouter} />;
}
