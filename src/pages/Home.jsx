import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useUserStore from "../stores/userStore";

function Home() {
	const logout = useUserStore((state) => state.logout);
	const role = useUserStore((state) => state.role);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 100);
		return () => clearTimeout(timer);
	}, []);

	return <div className="">home</div>;
}

export default Home;
