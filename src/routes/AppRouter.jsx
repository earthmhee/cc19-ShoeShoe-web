// import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
// import useUserStore from "../stores/userStore";
// import App from "../App";

// const guestRouter = createBrowserRouter([
// 	{
// 		path: "/",
// 		element: <App />,
// 		children: [
// 			{ index: true, element: <p>home</p> },
// 			{ path: "/login", element: <p>login</p> },
// 			{ path: "/register", element: <p>register</p> },
// 			{ path: "*", element: <Navigate to="/login" /> },
// 		],
// 	},
// ]);

// export default function AppRouter() {
// 	const user = useUserStore((state) => state.user);
// 	const finalRouter =
// 		user?.role === "ADMIN"
// 			? adminRouter
// 			: user?.role === "USER"
// 			? userRouter
// 			: guestRouter;

// 	return <RouterProvider key={user?.id} router={finalRouter} />;
// }
