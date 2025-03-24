import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
	LayoutGrid,
	Package,
	ShoppingBag,
	Users,
	ClipboardList,
	LogOut,
	Menu,
	X,
} from "lucide-react";
import useUserStore from "../stores/userStore";
import { useClerk, useUser } from "@clerk/clerk-react";
import { AdminChatProvider } from "../components/chat/AdminChatProvider";
import ChatInterface from "../components/chat/ChatInterface";
import { ShoeshoeLogo } from "../icons/index";

const AdminLayout = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const navigate = useNavigate();

	const { user, logout } = useUserStore();
	const { signOut } = useClerk();
	const { user: clerkUser } = useUser(); // Get the clerk user for profile image

	const handleLogout = async () => {
		try {
			await signOut();
			logout();
			navigate("/");
		} catch (error) {
			console.error("Error during logout:", error);
			navigate("/");
		}
	};

	const sidebarItems = [
		{ name: "Dashboard", path: "/", icon: <LayoutGrid size={20} /> },
		{ name: "Products", path: "/products", icon: <Package size={20} /> },
		{
			name: "Inventory",
			path: "/inventory",
			icon: <ClipboardList size={20} />,
		},
		{ name: "Orders", path: "/orders", icon: <ShoppingBag size={20} /> },
		{ name: "Customers", path: "/users", icon: <Users size={20} /> },
	];

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	// Get profile image URL or fallback to initial
	const profileImageUrl = clerkUser?.imageUrl;
	const userInitial = user ? user.charAt(0).toUpperCase() : "A";

	return (
		<AdminChatProvider>
			<div className="flex h-screen bg-gray-100">
				{/* Mobile sidebar backdrop */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
						onClick={() => setSidebarOpen(false)}
					></div>
				)}

				{/* Sidebar */}
				<div
					className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
						sidebarOpen ? "translate-x-0" : "-translate-x-full"
					}`}
				>
					<div className="flex flex-col h-full">
						{/* Sidebar header */}
						<div className="flex items-center justify-between h-16 px-4 border-b">
							<Link
								to="/"
								className="flex items-center text-xl font-semibold text-black"
							>
								<ShoeshoeLogo />
								<span className="ml-6 text-2xl">Admin</span>
							</Link>
							<button
								className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
								onClick={toggleSidebar}
							>
								<X size={20} />
							</button>
						</div>

						{/* Sidebar menu */}
						<nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
							{sidebarItems.map((item) => (
								<Link
									key={item.name}
									to={item.path}
									className="flex items-center px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100"
								>
									<span className="mr-3 text-gray-500">{item.icon}</span>
									{item.name}
								</Link>
							))}
						</nav>

						{/* User profile in sidebar */}
						<div className="p-4 border-t border-b">
							<div className="flex items-center space-x-3 mb-3">
								{profileImageUrl ? (
									<img
										src={profileImageUrl}
										alt="Profile"
										className="h-10 w-10 rounded-full object-cover"
									/>
								) : (
									<div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
										{userInitial}
									</div>
								)}
								<div>
									<p className="text-sm font-medium text-gray-700">
										{user || "Admin User"}
									</p>
									<p className="text-xs text-gray-500">Administrator</p>
								</div>
							</div>
						</div>

						{/* Logout button */}
						<div className="p-4">
							<button
								onClick={handleLogout}
								className="flex items-center w-full px-4 py-2 text-left text-red-600 rounded-md hover:bg-red-50"
							>
								<LogOut size={20} className="mr-3" />
								Logout
							</button>
						</div>
					</div>
				</div>

				{/* Main content */}
				<div className="flex flex-col flex-1 overflow-hidden">
					{/* Top header - simplified */}
					<header className="flex items-center h-16 px-6 bg-white border-b">
						<div className="flex items-center">
							<button
								className="p-1 mr-4 rounded-md hover:bg-gray-100 lg:hidden"
								onClick={toggleSidebar}
							>
								<Menu size={24} />
							</button>
						</div>
					</header>

					{/* Page content */}
					<main className="flex-1 p-6 overflow-y-auto">{children}</main>
				</div>

				{/* Chat Interface */}
				<ChatInterface />
			</div>
		</AdminChatProvider>
	);
};

export default AdminLayout;
