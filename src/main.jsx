import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes/AppRouter.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClerkProvider } from "@clerk/clerk-react";

///////////clerk//////////////////////////////////
// Import Publishable Key from .env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key from Clerk");
}
////////////////////////////////////////////////////////////////////
createRoot(document.getElementById("root")).render(
	<>
		{/* ClerkProvider have to be wrapped entire app at the entry point na krub */}
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
			{/* "afterSignOutUrl" is the path the guest should be land in first place */}
			<AppRouter />
			<ToastContainer position="top-center" style={{ zIndex: 9999 }} />
		</ClerkProvider>
	</>
);
