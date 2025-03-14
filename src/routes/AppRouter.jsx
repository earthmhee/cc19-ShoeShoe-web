import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import useUserStore from "../stores/userStore";
import App from "../App";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";

const guestRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Products/> },
			{ path: "/product/:id", element: <ProductDetail /> },
			{ path: "/login", element: <p>login</p> },
			{ path: "/register", element: <p>register</p> },
			{ path: "*", element: <Navigate to="/login" /> },
		],
	},
]);

export default function AppRouter() {
	const user = useUserStore((state) => state.user);
	const finalRouter =guestRouter

	return <RouterProvider key={user?.id} router={finalRouter} />;
}
