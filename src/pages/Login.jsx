// import { SignIn,SignedIn,SignedOut,SignInButton,UserButton, useSignIn, useUser,useAuth } from "@clerk/clerk-react";
// import { Link, useNavigate } from "react-router";
// import useUserStore from "../stores/userStore";

// function Login() {
// 	const { signIn, setActive } = useSignIn();
// 	const setUser = useUserStore((state) => state.setUser);
// 	const setToken = useUserStore((state) => state.setToken);
// 	const setRole = useUserStore((state) => state.setRole);
// 	const navigate = useNavigate();

// 	const { getToken } = useAuth();
//   const ActionGetMyAccount = useUserStore((state) => state.actionGetMyAccount);
//   useEffect(() => {
// 	const fetchData = async () => {
// 	  const token = await getToken();
// 	  console.log('token : ',token);
// 	  const res = await ActionGetMyAccount(token);
// 	};
// 	fetchData();
//  }, [getToken]);

//  const userData = useUserStore(state => state.userData)
//  console.log('userData : ', userData);
//  const { user } = useUser();
//  console.log("user : ", user);
//  console.log("role : ", user?.publicMetadata?.role);
//  const email = user?.emailAddresses?.[0]?.emailAddress;

// 	const handleSignIn = async () => {
// 		try {
// 			const result = await signIn.create();
// 			const session = result.createdSession;

// 			if (!session) {
// 				console.error("No session created");
// 				return;
// 			}

// 			const token = await session.getToken();
// 			const { user } = useUser();
// 			const role = user?.publicMetadata?.role || "user";

// 			// console.log("Sign-in data:", { user, token, role });

// 			if (!user || !token) {
// 				console.error("User or token is missing");
// 				return;
// 			}

// 			setUser(user);
// 			setToken(token);
// 			setRole(role);

// 			navigate("/");
// 		} catch (error) {
// 			console.error("Sign-in error:", error);
// 		}
// 	};

// 	return (
// 		<div className="flex flex-col items-center">
// 			<h1>เข้าสู่ระบบ</h1>
// 			<SignIn onSignIn={handleSignIn} signUpUrl="/register" />
// 			<p>
// 				ยังไม่มีบัญชี?{" "}
// 				<Link to="/register" className="text-blue-500">
// 					สมัครสมาชิก
// 				</Link>
// 			</p>
// 		</div>
// 	);
// }

// export default Login;

import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/clerk-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import useUserStore from "../stores/userStore";

function Login() {
	const { getToken } = useAuth();
	///// Zustand :
	const ActionGetMyAccount = useUserStore((state) => state.actionGetMyAccount);
	useEffect(() => {
		const fetchData = async () => {
			const token = await getToken();
			console.log("token : ", token);
			const res = await ActionGetMyAccount(token);
		};
		fetchData();
	}, [getToken]);
	// const actionUserAccount = useUserStore((state) => state.UserAccount) // for update user
	const userData = useUserStore((state) => state.userData);
	console.log("userData : ", userData);
	const { user } = useUser();
	console.log("user : ", user);
	console.log("role : ", user?.publicMetadata?.role);
	const email = user?.emailAddresses?.[0]?.emailAddress; // using optional chaining to avoid errors if it's undefined
	return (
		<>
			<SignedOut>
				<SignInButton />
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
			<p className="bg-white-200">header</p>
			<p>Hello : {user?.username || userData?.username}</p>
			<p>email : {email}</p>
		</>
	);
}

export default Login;
