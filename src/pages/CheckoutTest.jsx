// rafce
import { loadStripe } from "@stripe/stripe-js";
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import { useAuth } from "@clerk/clerk-react";
import { checkout } from "../api/payment";
import { useParams } from "react-router";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutTest = () => {
  // Javascript
  const { getToken } = useAuth();
  const { id } = useParams();

	const fetchClientSecret = async () => {
		const token = await getToken();
		try {
			const res = await checkout(token, id);
			console.log("fetchClientSecret response : ", res);
			return res.data.clientSecret;
		} catch (error) {
			console.log(error);
		}
	};

	const options = { fetchClientSecret };
	return (
		<div id="checkout" className="card shadow border py-20 max-w-6xl m-auto">
			<EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
				<EmbeddedCheckout />
			</EmbeddedCheckoutProvider>
		</div>
	);
};
export default CheckoutTest;
