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

	return (
		<nav className="flex justify-between p-4 bg-white shadow-md">
			<Link to="/" className="text-xl font-bold">
				CARNIVAL
			</Link>

			<div className="relative">
				<SignedOut>
					<Link to="/login" className="px-4 py-2 bg-black text-white rounded">
						บัญชีผู้ใช้ของฉัน
					</Link>
				</SignedOut>

				<SignedIn>
					<UserButton />
					{!isLoading && (
						<div className="absolute right-0 bg-white shadow-md p-2 w-40 hidden group-hover:block">
							{role === "admin" && (
								<Link to="/admin" className="block p-2 hover:bg-gray-100">
									Admin Dashboard
								</Link>
							)}
							<button
								onClick={() => {
									logout();
									window.location.href = "/login";
								}}
								className="block w-full text-left p-2 hover:bg-gray-100"
							>
								ออกจากระบบ
							</button>
						</div>
					)}
				</SignedIn>
			</div>
		</nav>
	);
}

export default Home;
