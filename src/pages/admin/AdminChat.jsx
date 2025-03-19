// src/pages/admin/AdminChat.jsx
import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { chatService } from "../../services/firebaseService";
import { useUser } from "@clerk/clerk-react";

function AdminChat() {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all active chats
  useEffect(() => {
    const db = getFirestore();
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, orderBy("lastMessageTime", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedChats = [];
      querySnapshot.forEach((doc) => {
        fetchedChats.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setChats(fetchedChats);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Listen for messages when a chat is selected
  useEffect(() => {
    if (!selectedChat) return;
    
    // Mark admin messages as read
    chatService.markAsRead(selectedChat.id, true);
    
    const unsubscribe = chatService.subscribeToMessages(selectedChat.id, (fetchedMessages) => {
      setMessages(fetchedMessages);
    });
    
    return () => unsubscribe();
  }, [selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedChat || !user) return;
    
    try {
      await chatService.sendMessage(
        selectedChat.id,
        user.id,
        newMessage,
        true
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Customer Support Chat</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-200px)]">
          {/* Chat list */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-medium">Active Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              {chats.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No active chats
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedChat?.id === chat.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{chat.userName}</h3>
                      {chat.unreadCountAdmin > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {chat.unreadCountAdmin}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm truncate">
                      {chat.lastMessage || "No messages yet"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {chat.lastMessageTime?.toDate().toLocaleString() || ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Chat window */}
          <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
            {!selectedChat ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start chatting
              </div>
            ) : (
              <>
                <div className="p-4 border-b">
                  <h2 className="font-medium">Chat with {selectedChat.userName}</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${
                        message.isAdmin ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block rounded-lg px-4 py-2 max-w-[70%] ${
                          message.isAdmin
                            ? "bg-black text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {message.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {message.createdAt?.toDate().toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-black text-white px-4 py-2 rounded-r-lg disabled:bg-gray-300"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminChat;