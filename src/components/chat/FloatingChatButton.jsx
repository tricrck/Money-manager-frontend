import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, X, Send, User, Clock, CheckCircle2, AlertCircle, ExternalLink, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  sendChatMessage, 
  getChatMessages, 
  markMessagesAsRead, 
  getUnreadCountAction 
} from '../../actions/chatActions';

const FloatingChatButton = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [localMessages, setLocalMessages] = useState([
    {
      id: 'welcome',
      senderType: 'admin',
      content: 'Hi! I\'m here to help. Feel free to ask questions, report issues, or share feedback.',
      createdAt: new Date(Date.now() - 60000),
      status: 'delivered'
    }
  ]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Redux state
  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading: sendingMessage, success: messageSent } = useSelector((state) => state.chatSendMessage);
  const { messages: reduxMessages, loading: loadingMessages } = useSelector((state) => state.chatMessages);
  const { count: unreadCount } = useSelector((state) => state.chatUnreadCount);

  // Get conversation ID from messages or create a default one for floating chat
  const selectedConversationId = reduxMessages && reduxMessages.length > 0 
    ? reduxMessages[0]?.conversationId 
    : 'floating-chat-default';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  useEffect(() => {
    // Get unread count when component mounts
    if (userInfo) {
      dispatch(getUnreadCountAction());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    // Load messages when chat opens
    if (isOpen && userInfo && selectedConversationId) {
      dispatch(getChatMessages(selectedConversationId));
      dispatch(markMessagesAsRead({ conversationId: selectedConversationId }));
    }
  }, [isOpen, dispatch, userInfo, selectedConversationId]);

  useEffect(() => {
    // Update local messages when Redux messages change
    if (reduxMessages && reduxMessages.length > 0) {
      const sortedMessages = [...reduxMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setLocalMessages(sortedMessages);
    }
  }, [reduxMessages]);

  useEffect(() => {
    // Reset message input after successful send
    if (messageSent && selectedConversationId) {
      setMessage('');
      setSelectedFile(null);
      // Refresh messages
      dispatch(getChatMessages(selectedConversationId));
    }
  }, [messageSent, dispatch, selectedConversationId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && userInfo && selectedConversationId) {
      const messageData = {
        conversationId: selectedConversationId,
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400 animate-pulse" />;
      case 'sent':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCircle2 className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const quickActions = [
    { text: "Report a Bug", icon: AlertCircle, type: 'bug_report' },
    { text: "Ask a Question", icon: MessageCircle, type: 'question' },
    { text: "Request Feature", icon: User, type: 'feature_request' },
  ];

  const handleQuickAction = (actionText, actionType) => {
    setMessage(actionText);
    // You could also auto-send or add metadata about the message type
  };

  const handleOpenChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && userInfo && selectedConversationId) {
      dispatch(markMessagesAsRead({ conversationId: selectedConversationId }));
      dispatch(getUnreadCountAction());
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpenChat}
          className={`
            w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110
            ${isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-180' 
              : 'bg-blue-600 hover:bg-blue-700'
            }
            text-white flex items-center justify-center
          `}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
        
        {/* Notification Badge */}
        {!isOpen && unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-40 flex flex-col border border-gray-200">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Support Chat</h3>
                <p className="text-xs text-blue-100">Usually replies instantly</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to="/chat"
                className="p-1 hover:bg-blue-700 rounded transition-colors"
                title="Open full chat"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Online</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {localMessages.length <= 1 && (
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-1">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.text, action.type)}
                    className="flex items-center space-x-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                  >
                    <action.icon className="w-3 h-3" />
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {loadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {localMessages.map((msg) => (
                  <div
                    key={msg._id || msg.id}
                    className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-xs px-3 py-2 rounded-lg text-sm
                        ${msg.senderType === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }
                      `}
                    >
                      <p>{msg.content}</p>
                      {msg.attachment && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          📎 {msg.attachment.name}
                        </div>
                      )}
                      <div className={`flex items-center space-x-1 mt-1 ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-xs ${msg.senderType === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(msg.createdAt)}
                        </span>
                        {msg.senderType === 'user' && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {sendingMessage && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none max-w-xs">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-200">
            {!userInfo ? (
              <div className="text-center text-sm text-gray-500">
                <Link to="/login" className="text-blue-600 hover:underline">
                  Please login to send messages
                </Link>
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={(!message.trim() && !selectedFile) || sendingMessage}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    {sendingMessage ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 bg-opacity-10 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingChatButton;