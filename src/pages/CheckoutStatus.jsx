import { useAuth, useUser } from "@clerk/clerk-react";
import { checkOutStatus } from "../api/payment";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router";

const CheckoutComplete = () => {
	const navigate = useNavigate();
	const { session } = useParams();
	const { getToken } = useAuth();
	const [status, setStatus] = useState(null);
	const [loading, setLoading] = useState(true);

	// ดึง orderId จาก query string
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const orderId = queryParams.get("orderId");


	useEffect(() => {
		fetchPayment();
	}, []);

	const fetchPayment = async () => {
		setLoading(true);
		const token = await getToken();
		try {
			const res = await checkOutStatus(token, session);
			setStatus(res.data.status);

			setLoading(false);
		} catch (error) {
			console.log(error);
			alert("Error checking payment status. Please try again.");
			setLoading(false);
			navigate("/");
		}
	};

	if (status === "open") {
		return <Navigate to="/" />;
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
					<p className="text-lg text-gray-600">Processing your payment...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
				{/* ไอคอนเครื่องหมายถูก */}
				<div className="mb-6 border-5 bg-black border-black rounded-full w-fit mx-auto">
					<svg
						className="w-16 h-16 text-white mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M5 13l4 4L19 7"
						></path>
					</svg>
				</div>

				<h1 className="text-2xl font-bold text-gray-900 mb-4">
					Thank you for Shopping with Us!
				</h1>
				<p className="text-gray-600 mb-6">
					Your payment has been successfully completed.
				</p>

				{/* ปุ่ม */}
				<div className="flex justify-center gap-4">
					<Link
						to="/"
						className="bg-gray-900 text-white py-2 px-6 rounded-md hover:bg-gray-800 transition"
					>
						Continue Shopping
					</Link>
					<Link
						to={`/account/orders/${orderId}`}
						className="border border-gray-900 text-gray-900 py-2 px-6 rounded-md hover:bg-gray-100 transition"
					>
						View Order
					</Link>
				</div>
			</div>
		</div>
	);
};

export default CheckoutComplete;
