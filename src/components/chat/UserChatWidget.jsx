import React, { useState, useEffect, useRef } from 'react';
import { useUserChat } from './UserChatProvider';
import { useUser } from '@clerk/clerk-react';
import { MessageSquare, X, Send, MinusCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const UserChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useUser();
  
  const { 
    messages, 
    unreadCount, 
    sendMessage, 
    markMessagesAsRead,
    isLoading,
    error
  } = useUserChat();

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0 && !error) {
      markMessagesAsRead();
    }
  }, [isOpen, unreadCount, markMessagesAsRead, error]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && !error) {
      sendMessage(message);
      setMessage('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const minimizeChat = () => {
    setIsOpen(false);
  };

  const handleRetry = () => {
    // Force refresh the page to reinitialize the chat
    window.location.reload();
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 focus:outline-none transition-all chat-button"
        aria-label="Open chat"
      >
        <MessageSquare size={24} />
        {unreadCount > 0 && !error && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col transition-all animate-slide-up chat-window">
          {/* Chat Header */}
          <div className="bg-black text-white p-3 flex items-center justify-between">
            <div className="flex-1 mx-2">
              <h3 className="font-semibold text-sm">Customer Support</h3>
              <p className="text-xs opacity-80">
                {isLoading ? 'Connecting...' : error ? 'Connection error' : 'We typically reply within minutes'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                className="p-1 rounded-full hover:bg-gray-700"
                onClick={minimizeChat}
                aria-label="Minimize chat"
              >
                <MinusCircle size={20} />
              </button>
              <button 
                className="p-1 rounded-full hover:bg-gray-700"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-auto p-3 bg-gray-50 max-h-96 space-y-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-gray-700">
                <AlertTriangle size={32} className="mx-auto mb-2 text-red-500" />
                <p className="mb-2 font-medium">Connection Error</p>
                <p className="text-sm mb-4">{error}</p>
                <button 
                  onClick={handleRetry}
                  className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Retry Connection
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">👋 Welcome to our customer support!</p>
                <p className="text-sm">Send us a message and we'll get back to you soon.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'} message-bubble`}
                >
                  {msg.senderType === 'admin' && (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2 flex-shrink-0">
                      CS
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] ${
                      msg.senderType === 'user'
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-xs block mt-1 ${
                      msg.senderType === 'user' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  {msg.senderType === 'user' && user?.imageUrl && (
                    <div className="h-8 w-8 rounded-full overflow-hidden ml-2 flex-shrink-0">
                      <img 
                        src={user.imageUrl} 
                        alt={user.fullName || 'User'} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="border-t p-3 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:border-black"
              disabled={isLoading || error}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading || error}
              className={`px-3 py-2 rounded-r-lg ${
                message.trim() && !isLoading && !error
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserChatWidget;