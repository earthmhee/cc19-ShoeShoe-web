import { Outlet } from "react-router";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/clerk-react";
import "./App.css";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
// import CheckoutCardMockup from "./pages/Checkoutmockup";
import ResponsiveNavigation from "./components/Sidebar";
import AccountSidebar from "./components/accountManage/Accountsidebar";
import AccountDashboard from "./components/accountManage/Accountdashboard";
import AccountInformation from "./components/accountManage/Accountinformation";
import AddressBookForm from "./components/accountManage/Addressbook";
import Addressbook from "./components/accountManage/Addressbook";

import Layout from "./layouts/Layouts";
import "./App.css";
import SidebarResponsive from "./components/Sidebar";
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
