// src/components/Addressbook.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const emptyData = {
	firstName: "",
	lastName: "",
	homenum: "",
	phone: "",
	country: "thailand",
	province: "",
	district: "",
	subDistrict: "",
	postcode: "",
	// isDefaultShipping: false,
};

const Addressbook = () => {
	const [addresses, setAddresses] = useState([]);
	const [formData, setFormData] = useState(emptyData);
	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [subDistricts, setSubDistricts] = useState([]);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const { isSignedIn, getToken } = useAuth();
	const navigate = useNavigate();

	const handleCancel = () => {
		setFormData(emptyData);
	};

	// Fetch provinces data
	useEffect(() => {
		const fetchProvinces = async () => {
			try {
				const response = await axios.get(
					"https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
				);
				setProvinces(response.data);
			} catch (err) {
				console.error("Error fetching provinces:", err);
				setError("Failed to load province data. Please check the API URL.");
				setProvinces([]);
			}
		};
		fetchProvinces();
	}, []);

	// Fetch existing addresses from backend
	useEffect(() => {
		if (!isSignedIn) {
			navigate("/");
			return;
		}
		const fetchAddresses = async () => {
			try {
				const token = await getToken();
				const response = await axios.get("http://localhost:8001/api/address", {
					headers: { Authorization: `Bearer ${token}` },
				});
				console.log(response);
				setAddresses(response.data.addresses);
			} catch (err) {
				console.error("Error fetching addresses:", err);
			}
		};

		fetchAddresses();
	}, [isSignedIn, getToken, navigate, addresses.length]);

	useEffect(() => {
		if (formData.province) {
			const selectedProvince = provinces.find(
				(p) => p.name_en === formData.province
			);
			setDistricts(selectedProvince ? selectedProvince.amphure : []);
			setFormData((prev) => ({
				...prev,
				district: "",
				subDistrict: "",
				postcode: "",
			}));
		}
	}, [formData.province, provinces]);

	useEffect(() => {
		if (formData.district) {
			const selectedDistrict = districts.find(
				(d) => d.name_en === formData.district
			);
			setSubDistricts(selectedDistrict ? selectedDistrict.tambon : []);
			setFormData((prev) => ({ ...prev, subDistrict: "", postcode: "" }));
		}
	}, [formData.district, districts]);

	useEffect(() => {
		if (formData.subDistrict) {
			const selectedSubDistrict = subDistricts.find(
				(s) => s.name_en === formData.subDistrict
			);
			setFormData((prev) => ({
				...prev,
				postcode: selectedSubDistrict ? selectedSubDistrict.zip_code : "",
			}));
		}
	}, [formData.subDistrict, subDistricts]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	// Submit form
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (addresses.length >= 3) {
			setError("Maximum 3 addresses allowed.");
			setSuccessMessage("");
			return;
		}
		try {
			const token = await getToken();
			const response = await axios.post(
				"http://localhost:8001/api/address",
				{
					firstName: formData.firstName,
					lastName: formData.lastName,
					homenum: formData.homenum,
					phone: formData.phone,
					country: formData.country,
					province: formData.province,
					district: formData.district,
					subDistrict: formData.subDistrict,
					postcode: formData.postcode,
					// isDefaultShipping: formData.isDefaultShipping,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setAddresses([...addresses, response.data.homenum]);
			setFormData(emptyData);
			setSuccessMessage("Address added successfully!");
			setError("");
		} catch (err) {
			setError(err.response?.data?.data?.msg || "Failed to add address.");
			setSuccessMessage("");
			console.error("Address submit error:", err);
		}
	};

	// Handle edit address
	const handleEditAddress = (addressId) => {
		const addressToEdit = addresses.find((addr) => addr.id === addressId);
		if (addressToEdit) {
			setFormData({
				firstName: addressToEdit.firstName,
				lastName: addressToEdit.lastName,
				homenum: addressToEdit.homenum,
				phone: addressToEdit.phone,
				country: addressToEdit.country,
				province: addressToEdit.province,
				district: addressToEdit.district,
				subDistrict: addressToEdit.subDistrict,
				postcode: addressToEdit.postcode,
				// isDefaultShipping: addressToEdit.isDefaultShipping,
			});
		}
	};

	// Handle delete address
	const handleDeleteAddress = async (addressId) => {
		try {
			const token = await getToken();
			await axios.delete(`http://localhost:8001/api/address/${addressId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setAddresses(addresses.filter((addr) => addr.id !== addressId));
			setSuccessMessage("Address deleted successfully!");
			setError("");
		} catch (err) {
			setError(err.response?.data?.msg || "Failed to delete address.");
			setSuccessMessage("");
			console.error("Address delete error:", err);
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto">
			<div className="border-b border-gray-300 pb-2 mb-6">
				<h1 className="text-2xl font-bold text-gray-800">TON'S ACCOUNT</h1>
			</div>

			{/* Existing Addresses Collapse */}
			<div className="mb-6">
				<div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded shadow-xs">
					<input type="checkbox" />
					<div className="collapse-title text-md font-semibold text-gray-800 px-6">
						SHIPPING ADDRESSES ({addresses.length}/3)
					</div>
					<div className="collapse-content text-sm">
						{addresses.length === 0 ? (
							<p className="text-gray-500">No addresses added yet.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{addresses.map((addr) => (
									<div
										key={addr?.id}
										className="card bg-base-100 shadow-md border border-gray-200 rounded-lg p-4"
									>
										<div
											className="flex justify-between items-center"
											key={addr?.id}
										>
											<p className="text-sm">
												{addr?.id} {addr?.firstName} {addr?.lastName} -{" "}
												{addr?.homenum}, {addr?.subDistrict}, {addr?.district},{" "}
												{addr?.province}, {addr?.postcode} (Phone: {addr?.phone}
												)
											</p>
											{/* {addr.isDefaultShipping && (
												<span className="text-green-500 ml-2">Default</span>
											)} */}
										</div>
										<div className="card-actions mt-2">
											<button
												onClick={() => handleEditAddress(addr.id)}
												className="btn btn-sm btn-primary mr-2"
											>
												Edit
											</button>
											<button
												onClick={() => handleDeleteAddress(addr.id)}
												className="btn btn-sm btn-error"
											>
												Delete
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Add New Address Form */}
			<div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded shadow-xs">
				<input type="checkbox" defaultChecked />
				<div className="collapse-title text-md font-semibold text-gray-800 px-6">
					ADD NEW ADDRESS
				</div>
				<div className="collapse-content text-sm">
					<form onSubmit={handleSubmit} className="bg-white p-6 rounded">
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
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
									required
									placeholder="First Name"
								/>
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
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
									required
									placeholder="Last Name"
								/>
							</div>

							{/* Address */}
							<div>
								<label
									htmlFor="homenum"
									className="block mb-2 text-sm font-medium text-gray-700"
								>
									Address <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="homenum"
									name="homenum"
									value={formData.homenum}
									onChange={handleChange}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
									required
									placeholder="Address"
								/>
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
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
									required
									placeholder="Phone Number"
								/>
							</div>

							{/* Country */}
							<div>
								<label
									htmlFor="country"
									className="block mb-2 text-sm font-medium text-gray-700"
								>
									Country <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										id="country"
										name="country"
										value={formData.country}
										onChange={handleChange}
										className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
										required
										disabled
									>
										<option value="thailand">Thailand</option>
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

							{/* Province */}
							<div>
								<label
									htmlFor="province"
									className="block mb-2 text-sm font-medium text-gray-700"
								>
									Province <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										id="province"
										name="province"
										value={formData.province}
										onChange={handleChange}
										className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
										required
									>
										<option value="">Please select a province</option>
										{provinces.map((province) => (
											<option key={province.id} value={province.name_en}>
												{province.name_en}
											</option>
										))}
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
								{formData.province === "" && (
									<p className="text-blue-500 mt-1">Please select a province</p>
								)}
							</div>

							{/* District */}
							<div>
								<label
									htmlFor="district"
									className="block mb-2 text-sm font-medium text-gray-700"
								>
									District <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<select
										id="district"
										name="district"
										value={formData.district}
										onChange={handleChange}
										className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
										required
									>
										<option value="">Please select a district</option>
										{districts.map((district) => (
											<option key={district.id} value={district.name_en}>
												{district.name_en}
											</option>
										))}
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
								{formData.district === "" && formData.province !== "" && (
									<p className="text-blue-500 mt-1">Please select a district</p>
								)}
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
										className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
										required
									>
										<option value="">Please select a subdistrict</option>
										{subDistricts.map((subDistrict) => (
											<option key={subDistrict.id} value={subDistrict.name_en}>
												{subDistrict.name_en}
											</option>
										))}
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
								{formData.subDistrict === "" && formData.district !== "" && (
									<p className="text-blue-500 mt-1">
										Please select a subdistrict
									</p>
								)}
							</div>

							{/* Zip/Postal Code */}
							<div>
								<label
									htmlFor="postcode"
									className="block mb-2 text-sm font-medium text-gray-700"
								>
									Zip/Postal Code <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="postcode"
									name="postcode"
									value={formData.postcode}
									onChange={handleChange}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
									required
									placeholder="Zip/Postal Code"
									disabled
								/>
							</div>
						</div>

						{/* Default Shipping Checkbox */}
						{/* <div className="mt-6 flex items-center">
							<input
								type="checkbox"
								id="isDefaultShipping"
								name="isDefaultShipping"
								checked={formData.isDefaultShipping}
								onChange={handleChange}
								className="checkbox checkbox-xs mr-2 checked:bg-black checked:text-white rounded"
							/>
							<label
								htmlFor="isDefaultShipping"
								className="ml-2 text-gray-700 font-medium"
							>
								DEFAULT SHIPPING ADDRESS
							</label>
						</div> */}

						{/* Action Buttons */}
						<div className="mt-8 flex justify-end gap-4">
							<button
								type="button"
								onClick={handleCancel}
								className="btn w-20 h-8 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
							>
								CANCEL
							</button>
							<button
								type="submit"
								disabled={addresses.length >= 3}
								className="btn w-20 h-8 rounded bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								SAVE
							</button>
						</div>
						{error && <p className="text-red-500 mt-2">{error}</p>}
						{successMessage && (
							<p className="text-green-500 mt-2">{successMessage}</p>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default Addressbook;
