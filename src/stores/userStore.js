import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const host = "http://localhost:8001"; //เดี๋ยวไปใส่ env

const useUserStore = create(
	persist(
		(set, get) => ({
			user: null,
			token: "",
			login: async (input) => {
				const res = await axios.post(`${host}/auth/login`, input); //Please check
				set({
					user: res.data?.user,
					token: res.data?.token,
				});
				return res.data;
			},
			logout: () => set({ user: null, token: "" }),
		}),
		{ name: "state", storage: createJSONStorage(() => localStorage) }
	)
);

export default useUserStore;
