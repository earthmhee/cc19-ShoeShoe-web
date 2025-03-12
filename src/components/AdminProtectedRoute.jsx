import { Navigate } from "react-router";
import useUserStore from "../stores/userStore";
import { useEffect, useState } from "react";

function AdminRoute({ page, navTo = "/" }) {
	const role = useUserStore((state) => state.role);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 100);
		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return role === "admin" ? page : <Navigate to={navTo} />;
}

export default AdminRoute;
