import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function AddressSelect() {
	const emptyData = {
		firstname: "",
		lastname: "",
		homenum: "",
		phone: "",
		country: "thailand",
		province: "",
		district: "",
		subdistrict: "",
		postcode: "",
		// isDefaultShipping: false,
	};

	const [addresses, setAddresses] = useState([]);
	const [select, setSelect] = useState(false);
	const { isSignedIn, getToken } = useAuth();
	const navigate = useNavigate();

	const handleSelect = () => {
		setSelect(!select);
	};

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

	return (
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
									className={`card bg-base-100 shadow-md border border-gray-200 rounded-lg p-4 ${
										handleSelect ? "border-black border-8" : ""
									}`}
									onClick={() => {
										handleSelect;
									}}
								>
									<div
										className="flex justify-between items-center"
										key={addr?.id}
									>
										<p className="text-sm">
											{addr?.firstname} {addr?.lastname} - {addr?.homenum},{" "}
											{addr?.subdistrict}, {addr?.district}, {addr?.province},{" "}
											{addr?.postcode} (Phone: {addr?.phone})
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default AddressSelect;
