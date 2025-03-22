import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function AddressSelect({ onSelectAddress }) {
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
	const [select, setSelect] = useState(null);
	const { isSignedIn, getToken } = useAuth();
	const navigate = useNavigate();

	const handleSelect = (id) => {
		setSelect(select === id ? null : id);
		console.log(select);
		if (onSelectAddress) {
			onSelectAddress(id); // ส่ง addressId กลับไปยัง parent component
		}
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
				console.error("No address found", err);
			}
		};

		fetchAddresses();
	}, [isSignedIn, getToken, navigate, addresses.length]);

	return (
		<div className="mb-2">
			<div className="collapse collapse-open collapse-arrow border border-base-300 bg-gray-50 p-0 rounded-lg h-fit" >
				<input type="checkbox " />
				<div className="collapse-title text-sm font-semibold text-gray-800 px-6">
					SELECT SHIPPING ADDRESSES
				</div>
				<div className="collapse-content text-sm">
					{addresses.length === 0 ? (
						<div className=" flex flex-col w-full items-center ">
							<p className="text-gray-500 m-4">No addresses added yet.</p>
							<div>
								<Link to={"/account/address"}>
									<button className="btn bg-black btn-sm text-white rounded hover:bg-gray-700 transition delay-50 duration-100 ease-in-out hover:scale-105">
										Add address
									</button>
								</Link>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-1 gap-4">
							{addresses.map((addr) => (
								<div
									key={addr?.id}
									className={`card bg-base-100 rounded p-2 transition delay-50 duration-100 ease-in-out hover:cursor-pointer ${
										select === addr?.id
											? "border-black font-semi-bold scale-103 shadow-lg"
											: " border-gray-200 bg-gray-200 shadow-sm text-gray-400"
									} ${select !== null && select !== addr?.id ? "hidden" : ""}`}
									onClick={() => {
										handleSelect(addr?.id);
									}}
								>
									<div
										className="flex justify-between items-center"
										key={addr?.id}
									>
										<p className="text-sm">
											{addr?.firstname} {addr?.lastname} - {addr?.homenum},{" "}
											{addr?.subdistrict}, {addr?.district}, {addr?.province},{" "}
											{addr?.postcode} <br />
											Phone: {addr?.phone}
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
