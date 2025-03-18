import React from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

const AccountDashboard = () => {
	const { user: clerkUser } = useUser();
	const navigate = useNavigate();
	console.log(useUser());
	// Default user data if none is provided
	const userData = {
		name: clerkUser.fullName,
		email: clerkUser.emailAddresses[0]?.emailAddress,
		username: clerkUser.username,
		phone: clerkUser.phoneNumbers[0]?.phoneNumber,
		password: "asdf",
		subscribedToNewsletter: false,
	};

	// Use provided userData or default if not available
	const user = userData;

	return (
		<div className="w-full max-w-4xl">
			{/* Dashboard Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">ACCOUNT DASHBOARD</h1>
				<p className="text-gray-600 mt-1">
					Welcome back, {user.name.split(" ")[0]}!
				</p>
			</div>

			{/* Account Overview Section */}
			<div className="border border-gray-200 rounded p-6 mb-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-medium text-gray-800">
						My Account Information
					</h2>
					<button
						onClick={() => navigate("update")}
						className="text-gray-300 hover:text-gray-700 hover:cursor-pointer font-medium"
					>
						EDIT
					</button>
				</div>

				<div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
					<div>
						<p className="text-gray-500 text-sm">Name-Surname</p>
						<p className="text-gray-800">{user.name}</p>
					</div>

					<div>
						<p className="text-gray-500 text-sm">Email</p>
						<p className="text-gray-800">{user.email}</p>
					</div>

					<div>
						<p className="text-gray-500 text-sm">Username</p>
						<p className="text-gray-800">{user.username}</p>
					</div>

					<div>
						<p className="text-gray-500 text-sm">Phone Number</p>
						<p className="text-gray-800">{user.phone}</p>
					</div>
				</div>
				<div className="mt-4 flex items-center"></div>
				{/* <div className="mt-4 flex items-center">
					<input
						type="checkbox"
						id="newsletter"
						className="h-4 w-4 text-teal-600 border-gray-300 rounded"
						checked={user.subscribedToNewsletter}
						readOnly
					/>
					<label htmlFor="newsletter" className="ml-2 text-gray-700">
						Subscribe to the newsletter.
					</label>
				</div> */}
			</div>
		</div>
	);
};

export default AccountDashboard;
