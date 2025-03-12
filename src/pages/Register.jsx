import { SignUp } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router";
import useUserStore from "../stores/userStore";

function Register() {
	const setUser = useUserStore((state) => state.setUser);
	const setToken = useUserStore((state) => state.setToken);
	const setRole = useUserStore((state) => state.setRole);
	const navigate = useNavigate();

	const handleAuthSuccess = async (session) => {
		const token = await session.getToken();
		const user = session.user;
		const role = user?.publicMetadata?.role || "user";

		setUser(user);
		setToken(token);
		setRole(role);

		navigate("/"); // ใช้ useNavigate แทน
	};

	return (
		<div className="flex flex-col items-center">
			<h1>สมัครสมาชิก</h1>
			<SignUp afterSignUp={handleAuthSuccess} />
			<p>
				มีบัญชีแล้ว?{" "}
				<Link to="/login" className="text-blue-500">
					เข้าสู่ระบบ
				</Link>
			</p>
		</div>
	);
}

export default Register;
