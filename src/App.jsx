import { Outlet } from "react-router";
import { SignedIn } from "@clerk/clerk-react";

import ResponsiveNavigation from "./components/Sidebar";
import Footer from "./components/Footer";
import { CartProvider } from "./components/CartProvider";
import UserChatProvider from "./components/chat/UserChatProvider";
import UserChatWidget from "./components/chat/UserChatWidget";
import "./components/chat/UserChat.css";

function App() {
	return (
		<div>
			<CartProvider>
				<ResponsiveNavigation />
				<div className="h-fit mt-2 ">
					<Outlet />
				</div>
				<Footer />
				<SignedIn>
					<UserChatProvider>
						<UserChatWidget />
					</UserChatProvider>
				</SignedIn>
			</CartProvider>
		</div>
	);
}

export default App;
