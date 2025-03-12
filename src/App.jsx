import { Outlet } from "react-router";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import Navbar from "./components/navbar";

function App() {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}

export default App