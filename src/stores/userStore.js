import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useUser } from "@clerk/clerk-react";

const useUserStore = create(
	persist(
		(set) => ({
			clerkID: null,
			user: null,
			token: null,
			role: null,

			setClerkID: (clerkID) => {
				set({ clerkID });
			},
			setUser: (user) => {
				set({ user });
			},
			setToken: (token) => {
				set({ token });
			},
			setRole: (role) => {
				set({ role });
			},

			logout: () => {
				set({ clerkID: null, user: null, token: null, role: null });
			},
		}),
		{
			name: "state",
			storage: createJSONStorage(() => localStorage),
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
