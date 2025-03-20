// src/components/AccountInformation.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { changePassword, createUpdateAccount } from "../../api/user";

const AccountInformation = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		phone: "",
	});

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [signOutOtherDevices, setSignOutOtherDevices] = useState(true);
	const [error, setError] = useState("");
	const [errorPassword, setErrorPassword] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [successMessagePassword, setSuccessMessagePassword] = useState("");

	const navigate = useNavigate();
	const { isSignedIn, isLoaded: authLoaded, getToken } = useAuth();
	const { user, isLoaded: userLoaded } = useUser();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (isSignedIn && userLoaded && user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				username: user.username || "",
				email: user.primaryEmailAddress?.emailAddress || "",
				phone: user.primaryPhoneNumber?.phoneNumber || "",
			});
		}
	}, [isSignedIn, user, userLoaded]);

	if (!authLoaded || !userLoaded) {
		return <div>Loading...</div>;
	}

	if (!isSignedIn) {
		navigate("/sign-in");
		return null;
	}

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (name === "signOutOtherDevices") {
			setSignOutOtherDevices(checked);
		} else {
			setFormData({
				...formData,
				[name]: type === "checkbox" ? checked : value,
			});
		}
	};

	const handleAccountSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = await getToken();
			const response = await createUpdateAccount(token, formData);
			if (response.status === 200) {
				setSuccessMessage("Account information updated successfully!");
				setError("");
			} else {
				throw new Error(response.data.msg || "Failed to update account");
			}
		} catch (err) {
			setError(err.message || "Failed to update account information");
			setSuccessMessage("");
			console.error("Account update error:", err);
		}
	};

	const handleChangePassword = async (e) => {
		e.preventDefault();
		if (newPassword.trim() === "" || confirmPassword.trim() === "") {
			setErrorPassword("Please fill your password");
			setSuccessMessagePassword("");
			return;
		}
		if (newPassword !== confirmPassword) {
			setErrorPassword("Passwords do not match");
			setSuccessMessagePassword("");
			return;
		}
		try {
			const token = await getToken();
			const response = await changePassword(
				token,
				newPassword,
				confirmPassword,
				signOutOtherDevices
			);
			console.log("Response:", response);
			if (response.status === 200) {
				setSuccessMessagePassword(
					response.data.msg || "Password changed successfully!"
				);
				setErrorPassword("");
				setNewPassword("");
				setConfirmPassword("");
				setSignOutOtherDevices(true);
			} else {
				throw new Error(response.data.error || "Failed to change password");
			}
		} catch (err) {
			setErrorPassword(
				err.message || "Failed to change password: Please try again."
			);
			setSuccessMessagePassword("");
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto flex flex-col min-h-screen">

			<div className="border-b border-gray-300 pb-2 mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					MY ACCOUNT INFORMATION
				</h1>
			</div>

			{/* Account Info Form */}
			<form onSubmit={handleAccountSubmit} className="mb-8 ">
				<div className="grid md:grid-cols-2 gap-x-8 gap-y-6 ">
					<div>
						<label
							htmlFor="firstName"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							First Name
						</label>
						<input
							type="text"
							id="firstName"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
							placeholder="First Name"
						/>
					</div>
					<div>
						<label
							htmlFor="lastName"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Last Name
						</label>
						<input
							type="text"
							id="lastName"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
							placeholder="Last Name"
						/>
					</div>
					<div>
						<label
							htmlFor="username"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className="w-full p-2 bg-gray-100 text-gray-400 border border-gray-300 rounded focus:outline-none"
							placeholder="Username"
							disabled
						/>
					</div>
					<div>
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full p-2 bg-gray-100 text-gray-400 border border-gray-300 rounded focus:outline-none"
							disabled
							placeholder="Email"
						/>
					</div>
					<div>
						<label
							htmlFor="phone"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Phone Number
						</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							className="w-full p-2 bg-gray-100 text-gray-400 border border-gray-300 rounded focus:outline-none"
							placeholder="Phone Number"
							disabled
						/>
					</div>
				</div>
				<div className="mt-6 text-center">
					<button
						type="submit"
						className="btn px-12 py-3 rounded bg-black text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
					>
						SAVE
					</button>
				</div>
				{error && <p className="text-red-500 mt-2 text-center">{error}</p>}
				{successMessage && (
					<p className="text-green-500 mt-2 text-center">{successMessage}</p>
				)}
			</form>


			{/* change password */}
			<div className="collapse collapse-arrow  bg-base-100 border-base-300 border rounded shadow-xs ">
				<input
					type="checkbox"
					checked={isOpen}
					onChange={() => setIsOpen(!isOpen)}
				/>
				<div className="collapse-title text-md font-semibold text-gray-800 px-6 ">
					CREATE NEW PASSWORD
				</div>
				<div className="collapse-content text-sm ">
					{/* Set Password Section */}
					<div className="mt-0 ">
						<form
							onSubmit={handleChangePassword}
							className="bg-white p-6 rounded "
						>
							<div className="mb-4">
								<label
									htmlFor="newPassword"
									className="block mb-2 text-sm font-medium text-gray-700"
								>
									New Password
								</label>
								<input
									type="password"
									id="newPassword"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
									placeholder="Enter new password"
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="confirmPassword"
									className="block mb-2 text-sm font-medium text-gray-700"
								>
									Confirm Password
								</label>
								<input
									type="password"
									id="confirmPassword"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
									placeholder="Confirm new password"
								/>
							</div>
							<div className="mb-4 flex items-center">
								<input
									type="checkbox"
									id="signOutOtherDevices"
									name="signOutOtherDevices"
									checked={signOutOtherDevices}
									onChange={handleChange}
									className="checkbox checkbox-xs mr-2 checked:bg-black checked:text-white rounded"
								/>
								<label
									htmlFor="signOutOtherDevices"
									className="text-sm text-gray-600"
								>
									Sign out of all other devices
								</label>
							</div>
							<div className="flex justify-end space-x-2">
								<button
									type="button"
									onClick={() => {
										setNewPassword("");
										setConfirmPassword("");
										setSignOutOtherDevices(true);
										setErrorPassword("");
										setSuccessMessagePassword("");
									}}
									className="btn w-20 h-8 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn w-20 h-8 rounded bg-black text-white hover:bg-gray-600"
								>
									Save
								</button>
							</div>
							{errorPassword && (
								<p className="text-red-500 mt-2">{errorPassword}</p>
							)}
							{successMessagePassword && (
								<p className="text-green-500 mt-2">{successMessagePassword}</p>
							)}
						</form>
					</div>
				</div>
			</div>

		</div>
	);
};

export default AccountInformation;
