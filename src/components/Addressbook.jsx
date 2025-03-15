import React, { useState } from "react";

const Addressbook = () => {
	// State for form fields
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		address: "",
		phone: "",
		country: "",
		stateProvince: "",
		city: "",
		subDistrict: "",
		zipCode: "",
		isDefaultShipping: false,
	});

	// Handle input changes
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		// Here you would typically send the data to your backend
		console.log("Form submitted:", formData);
	};

	// Handle back button click
	const handleBack = () => {
		// You would typically implement navigation logic here
		console.log("Back button clicked");
	};

	return (
		<div className="w-full max-w-4xl">
			<div className="border-b border-gray-300 pb-2 mb-6">
				<h1 className="text-xl font-bold text-gray-800">Add New Address</h1>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
					{/* First Name */}
					<div>
						<label
							htmlFor="firstName"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							First Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="firstName"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
							required
						/>
					</div>

					{/* State/Province */}
					<div>
						<label
							htmlFor="stateProvince"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							State/Province <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<select
								id="stateProvince"
								name="stateProvince"
								value={formData.stateProvince}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
								required
							>
								<option value="">
									Please select a region, state or province.
								</option>
								<option value="bangkok">Bangkok</option>
								<option value="chiang_mai">Chiang Mai</option>
								<option value="phuket">Phuket</option>
								<option value="other">Other</option>
							</select>
							<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
								<svg
									className="w-4 h-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</div>
						</div>
					</div>

					{/* Last Name */}
					<div>
						<label
							htmlFor="lastName"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Last Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="lastName"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
							required
						/>
					</div>

					{/* City */}
					<div>
						<label
							htmlFor="city"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							City <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<select
								id="city"
								name="city"
								value={formData.city}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
								required
							>
								<option value="">Please select district.</option>
								{/* City options would typically be populated based on selected state/province */}
							</select>
							<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
								<svg
									className="w-4 h-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</div>
						</div>
					</div>

					{/* Address */}
					<div>
						<label
							htmlFor="address"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Address <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="address"
							name="address"
							value={formData.address}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
							required
						/>
					</div>

					{/* Sub District */}
					<div>
						<label
							htmlFor="subDistrict"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Sub District <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<select
								id="subDistrict"
								name="subDistrict"
								value={formData.subDistrict}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
								required
							>
								<option value="">Please select subdistrict.</option>
								{/* Sub-district options would typically be populated based on selected city */}
							</select>
							<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
								<svg
									className="w-4 h-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</div>
						</div>
					</div>

					{/* Phone Number */}
					<div>
						<label
							htmlFor="phone"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Phone Number <span className="text-red-500">*</span>
						</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
							required
						/>
					</div>

					{/* Zip/Postal Code */}
					<div>
						<label
							htmlFor="zipCode"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Zip/Postal Code <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="zipCode"
							name="zipCode"
							value={formData.zipCode}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
							required
						/>
					</div>

					{/* Country */}
					<div>
						<label
							htmlFor="country"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Country
						</label>
						<div className="relative">
							<select
								id="country"
								name="country"
								value={formData.country}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
							>
								<option value="">Select a country</option>
								<option value="thailand">Thailand</option>
								<option value="singapore">Singapore</option>
								<option value="malaysia">Malaysia</option>
								<option value="other">Other</option>
							</select>
							<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
								<svg
									className="w-4 h-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* Default Shipping Checkbox */}
				<div className="mt-6 flex items-center">
					<input
						type="checkbox"
						id="isDefaultShipping"
						name="isDefaultShipping"
						checked={formData.isDefaultShipping}
						onChange={handleChange}
						className="h-4 w-4 text-black border-gray-300 rounded"
					/>
					<label
						htmlFor="isDefaultShipping"
						className="ml-2 text-gray-700 font-medium"
					>
						DEFAULT SHIPPING ADDRESS
					</label>
				</div>

				{/* Action Buttons */}
				<div className="mt-8 flex gap-4">
					<button
						type="button"
						onClick={handleBack}
						className="px-12 py-3 bg-white text-black border border-gray-300 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
					>
						BACK
					</button>
					<button
						type="submit"
						className="px-12 py-3 bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
					>
						SAVE
					</button>
				</div>
			</form>
		</div>
	);
};

export default Addressbook;
