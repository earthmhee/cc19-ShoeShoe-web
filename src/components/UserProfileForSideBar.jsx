import React, { useState } from "react";
import {
	useUser,
	useAuth,
	UserProfile,
	UserButton,
	useClerk,
} from "@clerk/clerk-react";

function UserProfileForSideBar() {
	const { user } = useUser();
	const { signOut } = useAuth();
	const [isOpen, setIsOpen] = useState(false);

	const clerk = useClerk();
	return (
		<div className="flex items-center gap-3 bg-white p-4 rounded-lg w-full">
			{/* รูปโปรไฟล์ */}
			<img
				src={user?.imageUrl}
				alt={user?.fullName}
				className="w-14 h-14 rounded-full"
			/>
			{/* ข้อมูลผู้ใช้ */}
			<div className="flex flex-col">
				<p className="text-lg font-bold">
					{user?.fullName?.length > 15
						? user?.fullName.substring(0, 13) + "..."
						: user?.fullName}
					.
				</p>
				<p className="text-sm text-gray-500">
					{user?.primaryEmailAddress?.emailAddress}
				</p>

				{/* ปุ่ม Manage Account และ Sign Out */}
				<div className="flex gap-2 mt-2">
					<button
						onClick={() => clerk.openUserProfile()}
						className="btn px-3 py-1 border border-gray-300 rounded-md text-gray-700 text-sm "
					>
						Account
					</button>

					<button
						className="btn px-3 py-1 bg-slate-300 text-white rounded-md text-sm hover:bg-red-800"
						onClick={() => signOut()}
					>
						Sign out
					</button>
				</div>
			</div>
		</div>
	);
}

export default UserProfileForSideBar;
