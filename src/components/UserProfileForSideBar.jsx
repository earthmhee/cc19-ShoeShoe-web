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
		<div className="flex items-center gap-1.5  p-2 rounded-lg w-full shadow-secondary">
			{/* รูปโปรไฟล์ */}
			<div className="relative w-14 h-14 shine-effect rounded-full ">
				<img
					src={user?.imageUrl}
					alt={user?.fullName}
					className="w-14 h-14 rounded-full object-cover "
				/>
			</div>
			{/* ข้อมูลผู้ใช้ */}
			<div className="flex flex-col">
				<p className="text-lg font-bold mb-0 pb-0 h-fit leading-tight hover:">
					{user?.fullName?.length > 15
						? user?.fullName.substring(0, 13) + "..."
						: user?.fullName}
				</p>
				<p className="text-sm text-gray-500 mt-0 pt-0 h-fit leading-tight">
					{user?.primaryEmailAddress?.emailAddress}
				</p>

				{/* ปุ่ม Manage Account และ Sign Out */}
				<div className="flex gap-1.5 mt-1">
					<button
						onClick={() => clerk.openUserProfile()}
						className="btn gap-0.5 px-2 py-1 h-8 text-xs rounded-md text-gray-700 hover:text-black hover:bg-slate-50"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						Account
					</button>

					<button
						className="btn px-2 gap-1 py-1 h-8 bg-slate-300 text-white rounded-md text-xs hover:text-red-500 hover:bg-slate-200"
						onClick={() => signOut()}
					>
						<svg
							className="w-5 h-5"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
							<g
								id="SVGRepo_tracerCarrier"
								stroke-linecap="round"
								stroke-linejoin="round"
							></g>
							<g id="SVGRepo_iconCarrier">
								<path
									d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
								<path
									d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.3531 21.8897 19.1752 21.9862 17 21.9983M9.00195 17C9.01406 19.175 9.11051 20.3529 9.87889 21.1213C10.5202 21.7626 11.4467 21.9359 13 21.9827"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								></path>
							</g>
						</svg>
						Sign out
					</button>
				</div>
			</div>
		</div>
	);
}

export default UserProfileForSideBar;
