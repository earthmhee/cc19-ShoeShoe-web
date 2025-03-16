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
import CheckoutCardMockup from "./pages/Checkoutmockup";
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
function App() {
	return (
		<div>
			<ResponsiveNavigation />
			<div className="h-fit mt-2">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}

export default App;
