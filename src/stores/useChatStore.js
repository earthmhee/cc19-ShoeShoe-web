import { create } from "zustand";
import { getUserChat } from "../api/chat";

const { getToken } = useAuth();
const token = await getToken()

const useChatStore = create({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    
    set({ isUsersLoading: true });
    try {
        const res = await getUserChat(token);
        set({ users: res.data });
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  
  getMessages: async (userId) => {
      
  }
});

export default useChatStore;
