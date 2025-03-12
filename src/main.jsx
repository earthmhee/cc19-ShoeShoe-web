import { createRoot } from "react-dom/client";
import "./index.css";
// import AppRouter from "./routes/AppRouter.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
	<>
    	<App />
		{/* <AppRouter /> */}
		<ToastContainer position="top-center" style={{ zIndex: 9999 }} />
	</>
);
