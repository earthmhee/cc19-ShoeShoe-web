import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useUser } from "@clerk/clerk-react";

const useUserStore = create(
	persist(
		(set) => ({
			user: null,
			token: null,
			role: null,

			setUser: (user) => {
				console.log("Setting user:", user);
				set({ user });
			},
			setToken: (token) => {
				console.log("Setting token:", token);
				set({ token });
			},
			setRole: (role) => {
				console.log("Setting role:", role);
				set({ role });
			},

			logout: () => {
				console.log("Logging out");
				set({ user: null, token: null, role: null });
			},
		}),
		{
			name: "user-state",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: (state) => {
				console.log("Rehydrated state from localStorage:", state);
			},
		}
	)
);

export default useUserStore;

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { getMyAccount } from "../api/user";

// const userStore = (set) => ({
// 	userData: null,
// 	UserAccount: async (token, input) => {
// 		const rs = await createUpdateAccount(token, input);
// 		console.log("User", rs);
// 		set({ userData: rs.data.results });
// 	},
// 	actionGetMyAccount: async (token) => {
// 		const rs = await getMyAccount(token);
// 		console.log("response", rs);
// 		set({ userData: rs.data.results });
// 	},
// });

// // keep data on Local Storage with persist
// const useUserStore = create(persist(userStore, { name: "user" }));

// export default useUserStore;
