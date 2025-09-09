import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; // Added missing imports
import { ArrowLeft, Send, User, Clock, CheckCircle2, Paperclip, MessageCircle } from 'lucide-react'; // Added MessageCircle
import { 
  sendChatMessage, 
  getChatMessages, 
  markMessagesAsRead 
} from '../../actions/chatActions';

const ChatPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { conversationId: paramId } = useParams();
  const location = useLocation();
  

  // Redux state
  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading: sendingMessage, success: messageSent } = useSelector((state) => state.chatSendMessage);
  const { messages, loading: loadingMessages, pagination } = useSelector((state) => state.chatMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectedConversationId = messages[0]?.conversationId || paramId;

  useEffect(() => {
    // Load messages when component mounts - only if we have a conversationId
    if (userInfo && selectedConversationId) {
      dispatch(getChatMessages(selectedConversationId)); // Pass conversationId as parameter
      dispatch(markMessagesAsRead({ conversationId: selectedConversationId })); // Pass as object
    }
  }, [dispatch, userInfo, selectedConversationId]);

  useEffect(() => {
    // Reset form after successful send
    if (messageSent && selectedConversationId) {
      setMessage('');
      setSelectedFile(null);
      dispatch(getChatMessages(selectedConversationId));
    }
  }, [messageSent, dispatch, selectedConversationId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && userInfo) {
      const messageData = {
        conversationId: selectedConversationId, // Fixed variable reference
        content: message.trim(),
        type: 'support',
        attachment: selectedFile ? {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size
        } : null
      };

      dispatch(sendChatMessage(messageData));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Support Chat</h1>
            <p className="text-sm text-gray-500">
              {userInfo ? `Logged in as ${userInfo.name}` : 'Not logged in'}
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!messages ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4" />
            <p>No conversation selected. Please select a conversation to view messages.</p>
          </div>
        ) : loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : messages && messages.length > 0 ? (
          <>
            {sortedMessages.map((msg, index) => {
              const showDate = index === 0 || 
                formatDate(sortedMessages[index - 1].createdAt) !== formatDate(msg.createdAt)
              return (
                <div key={msg._id || msg.id}>
                  {showDate && (
                    <div className="flex justify-center mb-4">
                      <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-sm lg:max-w-md px-4 py-3 rounded-lg text-sm
                        ${msg.senderType === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                        }
                      `}
                    >
                      <p>{msg.content}</p>
                      {msg.attachment && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                          📎 {msg.attachment.name}
                        </div>
                      )}
                      <div className={`flex items-center space-x-1 mt-2 ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-xs ${msg.senderType === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(msg.createdAt)}
                        </span>
                        {msg.senderType === 'user' && (
                          <CheckCircle2 className="w-3 h-3 text-blue-200" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4" />
            <p>No messages yet. Start a conversation!</p>
          </div>
        )}
        
        {/* Sending indicator */}
        {sendingMessage && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-lg rounded-bl-none max-w-sm shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        {!userInfo ? (
          <div className="text-center text-gray-500">
            <p>Please <a href="/login" className="text-blue-600 hover:underline">login</a> to send messages</p>
          </div>
        ) : !selectedConversationId ? (
          <div className="text-center text-gray-500">
            <p>Select a conversation to send messages</p>
          </div>
        ) : (
          <>
            {selectedFile && (
              <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                <span className="text-sm text-gray-600">📎 {selectedFile.name}</span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx"
                className="hidden"
              />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                placeholder="Type your message..."
                disabled={sendingMessage}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={(!message.trim() && !selectedFile) || sendingMessage}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
              >
                {sendingMessage ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;