import React, { useState } from "react";
import {
	useUser,
	useAuth,
	useClerk,
	SignedOut,
	SignedIn,
	SignOutButton,
	SignInButton,
	SignUpButton,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router";

function UserProfileForNavBar() {
	const { user } = useUser();
	const [showUserMenu, setShowUserMenu] = useState(false);

	const toggleUserMenu = () => {
		setShowUserMenu(!showUserMenu);
	};
	const navigate = useNavigate();

	const clerk = useClerk();
	return (
		<>
			<div className="relative">
				<SignedOut>
					<button
						className="p-2 text-gray-700 relative"
						onClick={toggleUserMenu}
						aria-expanded={showUserMenu}
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
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</button>
				</SignedOut>
				<SignedIn>
					<div
						className=" bg-white h-8 w-8 rounded-full hover:cursor-pointer shine-effect  "
						onClick={toggleUserMenu}
						aria-expanded={showUserMenu}
					>
						{/* Profile pic*/}
						<img
							src={user?.imageUrl}
							alt={user?.fullName}
							className="w-8 h-8 rounded-full"
						/>
					</div>
				</SignedIn>
				{showUserMenu && (
					<div
						className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1"
						onClick={toggleUserMenu}
						aria-expanded={showUserMenu}
					>
						<SignedOut>
							<SignInButton
								mode="modal"
								appearance={{
									elements: {
										footer: { display: "none" },
									},
								}}
							>
								<button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
									Sign in
								</button>
							</SignInButton>

							<SignUpButton
								mode="modal"
								appearance={{
									elements: {
										footer: { display: "none" },
									},
								}}
							>
								<button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
									Register
								</button>
							</SignUpButton>
						</SignedOut>
						<SignedIn>
							<button
								className="flex gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => navigate("/account")}
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
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								Account
							</button>
							<SignOutButton>
								<button className=" flex gap-2 hover:cursor-pointer hover:text-red-500 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
							</SignOutButton>
						</SignedIn>
					</div>
				)}
			</div>
			{showUserMenu && (
				<div
					className=" fixed inset-0 bg-none z-20 hover:cursor-pointer"
					onClick={toggleUserMenu}
					aria-hidden="true"
				></div>
			)}
		</>
	);
}

export default UserProfileForNavBar;
