// src/components/chat/ChatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Users, ArrowLeft, Send, Phone, Video, MinusCircle } from 'lucide-react';
import { useAdminChat } from './AdminChatProvider';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const { 
    activeChats, 
    currentChat, 
    setCurrentChat, 
    messages, 
    sendMessage, 
    unreadMessages,
    getTotalUnreadCount
  } = useAdminChat();

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowChatList(true);
    }
  };

  const openChatDetail = (chat) => {
    setCurrentChat(chat);
    setShowChatList(false);
  };

  const backToList = () => {
    setShowChatList(true);
    setCurrentChat(null);
  };

  const minimizeChat = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none transition-all"
      >
        <MessageSquare size={24} />
        {getTotalUnreadCount() > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {getTotalUnreadCount()}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col transition-all">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
            {!showChatList && currentChat ? (
              <>
                <button onClick={backToList} className="p-1 rounded-full hover:bg-blue-500">
                  <ArrowLeft size={20} />
                </button>
                <div className="flex-1 mx-2 truncate">
                  <h3 className="font-semibold text-sm">{currentChat.userName || 'Customer'}</h3>
                  <p className="text-xs opacity-80">
                    {currentChat.userEmail || `User ID: ${currentChat.userId}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 rounded-full hover:bg-blue-500">
                    <MinusCircle size={20} onClick={minimizeChat} />
                  </button>
                  <button className="p-1 rounded-full hover:bg-blue-500">
                    <X size={20} onClick={toggleChat} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center flex-1">
                  <Users size={20} className="mr-2" />
                  <h3 className="font-semibold">Customer Chats</h3>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 rounded-full hover:bg-blue-500">
                    <MinusCircle size={20} onClick={minimizeChat} />
                  </button>
                  <button className="p-1 rounded-full hover:bg-blue-500">
                    <X size={20} onClick={toggleChat} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-auto max-h-96">
            {showChatList ? (
              <div className="divide-y divide-gray-100">
                {activeChats.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No active chats
                  </div>
                ) : (
                  activeChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => openChatDetail(chat)}
                      className={`p-3 flex items-start hover:bg-gray-50 cursor-pointer ${
                        unreadMessages[chat.id] ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-3">
                        {chat.userName ? chat.userName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {chat.userName || 'Anonymous User'}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {chat.lastMessageTime?.toDate
                              ? new Date(chat.lastMessageTime.toDate()).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessageSender === 'admin' ? 'You: ' : ''}
                          {chat.lastMessage || 'New conversation'}
                        </p>
                        {unreadMessages[chat.id] > 0 && (
                          <span className="mt-1 inline-block bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {unreadMessages[chat.id]} new
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col p-3 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderType === 'admin' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[80%] ${
                        msg.senderType === 'admin'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className="text-xs mt-1 block opacity-70">
                        {msg.timestamp?.toDate
                          ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          {!showChatList && currentChat && (
            <form onSubmit={handleSendMessage} className="border-t p-3 flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-r-lg px-3 py-2 hover:bg-blue-700"
              >
                <Send size={20} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;