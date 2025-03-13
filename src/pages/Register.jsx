//***************************NO LONGER USING ******************************************/
// import { SignUp } from "@clerk/clerk-react";
// import { Link, useNavigate } from "react-router";
// import useUserStore from "../stores/userStore";

// function Register() {
// 	const setUser = useUserStore((state) => state.setUser);
// 	const setToken = useUserStore((state) => state.setToken);
// 	const setRole = useUserStore((state) => state.setRole);
// 	const navigate = useNavigate();

// 	const handleAuthSuccess = async (session) => {
// 		const token = await session.getToken();
// 		const user = session.user;
// 		const role = user?.publicMetadata?.role || "user";

// 		setUser(user);
// 		setToken(token);
// 		setRole(role);

// 		navigate("/"); // ใช้ useNavigate แทน
// 	};

// 	return <SignUp afterSignUp={handleAuthSuccess} />;
// }

// export default Register;
