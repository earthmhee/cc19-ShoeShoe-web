// src/components/SubLayout.jsx
import React from "react";
import { Outlet } from "react-router";
import AccountSidebar from "../components/accountManage/Accountsidebar";

const SubLayoutAccount = () => {
	return (
		<div className={`flex flex-col lg:flex-row min-h-screen max-w-7xl w-full mx-auto`}>

			{/* SubSidebar (ด้านซ้าย) */}
			<AccountSidebar />

			<div className="flex-1 p-6">
				<Outlet />
			</div>
		</div>
	);
};

export default SubLayoutAccount;
