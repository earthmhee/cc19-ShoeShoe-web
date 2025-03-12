import { create } from "zustand";
import { persist } from "zustand/middleware";

const userStore = (set) => ({
  userData: null,
  UserAccount: async (token, input) => {
    const rs = await createUpdateAccount(token, input);
    console.log("User", rs);
    set({ userData: rs.data.results });
  },
  GetMyAccount: async (token) => {
    const rs = await getMyAccount(token)
    console.log('response', rs);
    set({ userData: rs.data.results})
  }
});

// keep data on Local Storage with persist
const useUserStore = create(persist(userStore, { name: "user" }))

export default useUserStore