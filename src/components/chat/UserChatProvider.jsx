import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc,
  getDocs,
  where,
  updateDoc
} from 'firebase/firestore';
import { useAuth, useUser } from '@clerk/clerk-react';
import { db, integrateClerkWithFirebase } from '../../services/firebase-auth';

// Create Context
const UserChatContext = createContext();

export const useUserChat = () => useContext(UserChatContext);

export const UserChatProvider = ({ children }) => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const { getToken } = useAuth();
  const { user } = useUser();

  // First, integrate Clerk with Firebase
  useEffect(() => {
    const setupFirebaseAuth = async () => {
      if (!user || !getToken) return;
      
      try {
        await integrateClerkWithFirebase(getToken);
        setAuthError(null);
      } catch (error) {
        console.error("Firebase authentication error:", error);
        setAuthError("Authentication failed. Please try again later.");
        setIsLoading(false);
      }
    };

    setupFirebaseAuth();
  }, [user, getToken]);

  // Initialize or fetch user's chat
  useEffect(() => {
    if (!user || authError) {
      setIsLoading(false);
      return;
    }

    const initializeUserChat = async () => {
      try {
        // Check if user already has a chat
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);
        
        let userChatId;
        
        if (querySnapshot.empty) {
          // Create a new chat for this user
          const newChatRef = await addDoc(collection(db, 'chats'), {
            userId: user.id,
            userName: user.fullName || 'Customer',
            userEmail: user.primaryEmailAddress?.emailAddress || '',
            createdAt: serverTimestamp(),
            lastMessage: null,
            lastMessageTime: serverTimestamp(),
            lastMessageSender: null,
            userUnreadCount: 0,
            adminUnreadCount: 0,
            isActive: true
          });
          userChatId = newChatRef.id;
        } else {
          // Use existing chat
          userChatId = querySnapshot.docs[0].id;
        }
        
        setChatId(userChatId);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setAuthError("Failed to initialize chat. Please try again later.");
        setIsLoading(false);
      }
    };

    initializeUserChat();
  }, [user, authError]);

  // Subscribe to messages when chat ID is available
  useEffect(() => {
    if (!chatId || authError) return;
    
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(fetchedMessages);
      
      // Check for unread messages from admin
      const unreadAdminMessages = fetchedMessages.filter(
        msg => msg.senderType === 'admin' && !msg.read
      ).length;
      
      setUnreadCount(unreadAdminMessages);
    }, (error) => {
      console.error("Error listening to messages:", error);
      setAuthError("Failed to load messages. Please try again later.");
    });
    
    // Track user unread count (updates when chat is opened)
    const chatUnsubscribe = onSnapshot(doc(db, 'chats', chatId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        if (chatData.userUnreadCount) {
          setUnreadCount(chatData.userUnreadCount);
        }
      }
    }, (error) => {
      console.error("Error tracking chat updates:", error);
    });
    
    return () => {
      unsubscribe();
      chatUnsubscribe();
    };
  }, [chatId, authError]);

  // Send a message from the user
  const sendMessage = async (text) => {
    if (!chatId || !text.trim() || !user || authError) return;

    try {
      // Add the message to the messages subcollection
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text,
        senderId: user.id,
        senderName: user.fullName || 'Customer',
        senderType: 'user',
        timestamp: serverTimestamp(),
        read: false
      });

      // Update the chat document with last message info
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (chatDoc.exists()) {
        const currentAdminUnreadCount = chatDoc.data().adminUnreadCount || 0;
        
        await updateDoc(chatRef, {
          lastMessage: text,
          lastMessageTime: serverTimestamp(),
          lastMessageSender: 'user',
          adminUnreadCount: currentAdminUnreadCount + 1
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setAuthError("Failed to send message. Please try again later.");
    }
  };

  // Mark messages as read when user opens the chat
  const markMessagesAsRead = async () => {
    if (!chatId || authError) return;
    
    try {
      // Update the chat to set user unread count to 0
      await updateDoc(doc(db, 'chats', chatId), {
        userUnreadCount: 0
      });
      
      // Update all unread admin messages to read
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, where('senderType', '==', 'admin'), where('read', '==', false));
      const querySnapshot = await getDocs(q);
      
      const batch = [];
      querySnapshot.forEach((document) => {
        batch.push(updateDoc(doc(db, 'chats', chatId, 'messages', document.id), {
          read: true
        }));
      });
      
      await Promise.all(batch);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Context value to provide
  const value = {
    chatId,
    messages,
    unreadCount,
    isLoading,
    sendMessage,
    markMessagesAsRead,
    error: authError
  };

  return (
    <UserChatContext.Provider value={value}>
      {children}
    </UserChatContext.Provider>
  );
};

export default UserChatProvider;