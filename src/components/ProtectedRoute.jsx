import { Navigate } from "react-router";
import useUserStore from "../stores/userStore";
import { useEffect, useState } from "react";

function ProtectedRoute({ page }) {
	const token = useUserStore((state) => state.token);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 100);
		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return token ? page : <Navigate to="/login" />;
}

export default ProtectedRoute;
