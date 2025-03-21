import { useAuth, useUser } from "@clerk/clerk-react";
import { checkOutStatus } from "../api/payment";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";

const CheckoutComplete = () => {
	const navigate = useNavigate();
	const { session } = useParams();
	const { getToken } = useAuth();
	const [status, setStatus] = useState(null);

  useEffect(() => {
    // code
    fetchPayment();
  }, []);
  console.log('Before fetch payment');
  const fetchPayment = async () => {
    const token = await getToken();
    try {
      const res = await checkOutStatus(token, session);
      setStatus(res.data.status);
      alert("Payment success", res.data.message);
      console.log("Payment success", res.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

	if (status === "open") {
		return <Navigate to="/" />;
	}

	return <div>Loading...</div>;
};
export default CheckoutComplete;
