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
import AccountSidebar from "./components/Accountsidebar";
import AccountDashboard from "./components/Accountdashboard";
import AccountInformation from "./components/Accountinformation";
import AddressBookForm from "./components/Addressbook";
import Addressbook from "./components/Addressbook";

import Layout from "./layouts/Layouts";
import './App.css'
import SidebarResponsive from './components/Sidebar'
import Footer from "./components/Footer";
function App() {
	return (
		<>
			<ResponsiveNavigation />
			<Outlet />
			<Footer />
		</>
	);
}

export default App;
