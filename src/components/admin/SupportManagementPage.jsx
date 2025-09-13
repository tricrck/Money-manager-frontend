import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  User,
  Send,
  Paperclip,
  RefreshCw,
  MoreHorizontal,
  Archive,
  Star,
  Ban,
  Eye,
  Calendar
} from 'lucide-react';
import { 
  sendChatMessage, 
  getChatMessages, 
  markMessagesAsRead,
  getUnreadCountAction,
  getAllSupportMessagesAction
} from '../../actions/chatActions';

const SupportManagementPage = () => {
  const dispatch = useDispatch();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState(null);
  const [supportTickets, setSupportTickets] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showChat, setShowChat] = useState(false);

  // Redux state - Updated to match ChatPage.jsx and FloatingChatButton.jsx pattern
  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading: sendingMessage, success: messageSent } = useSelector((state) => state.chatSendMessage);
  const { messages, loading: loadingMessages } = useSelector((state) => state.chatMessages);
  const { messages: allSupportMessages, loading: loadingAllMessages } = useSelector((state) => state.chatAllGetMessages || {});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages]);

  useEffect(() => {
    // Load initial support tickets data
    if (userInfo) {
      dispatch(getAllSupportMessagesAction());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    // Update support tickets when allSupportMessages changes
    if (allSupportMessages?.conversations) {
      const mapped = allSupportMessages.conversations.map(conversation => ({
        id: conversation._id || conversation.conversationId,
        conversationId: conversation._id || conversation.conversationId,
        user: {
          _id: conversation.user._id,
          name: conversation.user.name || "Unknown",
          email: conversation.user.email || ""
        },
        subject: conversation.lastMessage?.slice(0, 30) || "No subject",
        status: conversation.status || "open",
        priority: conversation.priority || "medium",
        lastMessage: conversation.lastMessage || "No messages yet",
        lastMessageTime: conversation.lastMessageTime,
        lastMessageType: conversation.lastMessageType,
        unreadCount: conversation.unreadCount || 0,
        messageCount: conversation.messageCount || 0,
        assignedAgent: conversation.assignedAgent,
        createdAt: conversation.createdAt || conversation.lastMessageTime,
        messages: [] // Will be populated when conversation is selected
      }));
      setSupportTickets(mapped);
    }
  }, [allSupportMessages]);

  useEffect(() => {
    if (messages && selectedTicket && messages.length > 0) {
      
      // Filter messages for the current conversation and sort by creation time (oldest first)
      const conversationMessages = messages
        .filter(msg => msg.conversationId === selectedTicket.conversationId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(msg => ({
          id: msg._id || msg.id,
          content: msg.content,
          senderType: msg.senderType,
          createdAt: msg.createdAt,
          read: msg.read,
          attachment: msg.attachment,
          status: msg.status || 'delivered',
          conversationId: msg.conversationId
        }));

      setSelectedTicket(prev => ({
        ...prev,
        messages: conversationMessages
      }));
    }
  }, [messages, selectedTicket?.conversationId]);

  useEffect(() => {
  if (messageSent && selectedTicket?.conversationId) {
    setMessage('');
    setSelectedFile(null);
    dispatch(getChatMessages(selectedTicket.conversationId));
  }
}, [messageSent, dispatch, selectedTicket?.conversationId]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket({...ticket, messages: []});
    setShowChat(true);
    if (ticket.conversationId) {
      // Fetch the actual messages for this conversation
      dispatch(getChatMessages(ticket.conversationId));
      dispatch(markMessagesAsRead({ conversationId: ticket.conversationId }));
      
      // Update ticket to mark as read
      setSupportTickets(prev =>
        prev.map(t =>
          t.conversationId === ticket.conversationId
            ? { ...t, unreadCount: 0 }
            : t
        )
      );
    }
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedTicket(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && selectedTicket && userInfo) {
      const messageData = {
        recipientUserId: selectedTicket.user._id,
        conversationId: selectedTicket.conversationId,
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

  const handleTicketStatusChange = (conversationId, newStatus) => {
    setSupportTickets(prev => prev.map(ticket => 
      ticket.conversationId === conversationId ? { ...ticket, status: newStatus } : ticket
    ));
    
    if (selectedTicket?.conversationId === conversationId) {
      setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleTicketPriorityChange = (conversationId, newPriority) => {
    setSupportTickets(prev => prev.map(ticket => 
      ticket.conversationId === conversationId ? { ...ticket, priority: newPriority } : ticket
    ));
    
    if (selectedTicket?.conversationId === conversationId) {
      setSelectedTicket(prev => ({ ...prev, priority: newPriority }));
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'No messages yet';
    const time = new Date(timestamp);
    if (isNaN(time)) return 'Invalid date';

    const now = new Date();
    const diffInMinutes = Math.floor((now - time) / 60000);
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString();
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="flex h-[94dvh] bg-background">
      {/* Sidebar - Ticket List */}
      <div className={`w-full md:w-1/3 bg-card border-r border-border flex flex-col 
          ${showChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header - Fixed */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <h1 className="text-xl font-semibold text-foreground mb-4">Support Management</h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-input bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-input bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Ticket List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loadingAllMessages ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2" />
              <p className="text-sm">No support tickets found</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleSelectTicket(ticket)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedTicket?.id === ticket.id ? 'bg-accent border-accent-foreground/20' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{ticket.user.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{ticket.user.email}</p>
                    </div>
                  </div>
                  {ticket.unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {ticket.unreadCount}
                    </span>
                  )}
                </div>

                <h4 className="font-medium text-foreground mb-1 truncate">{ticket.subject}</h4>
                <p className="text-sm text-muted-foreground mb-2 truncate">{ticket.lastMessage}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(ticket.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col 
        ${!showChat ? 'hidden md:flex' : 'flex'}`}>
        {selectedTicket ? (
          <>
            {/* Chat Header - Fixed */}
            <div className="bg-card border-b border-border p-2 sm:p-4 flex-shrink-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  {/* Back button on mobile */}
                  <button 
                    onClick={handleBackToList}
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                  >
                    ←
                  </button>
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">{selectedTicket.user.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedTicket.subject}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-wrap md:flex-nowrap w-full md:w-auto">
                  {/* Status Dropdown */}
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleTicketStatusChange(selectedTicket.conversationId, e.target.value)}
                    className="w-full md:w-auto px-3 py-1 border border-input bg-background text-foreground rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>

                  {/* Priority Dropdown */}
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => handleTicketPriorityChange(selectedTicket.conversationId, e.target.value)}
                    className="w-full md:w-auto px-3 py-1 border border-input bg-background text-foreground rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 overscroll-contain">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                <>
                  {selectedTicket.messages.map((msg, index) => {
                    const showDate = index === 0 || 
                      formatDate(selectedTicket.messages[index - 1].createdAt) !== formatDate(msg.createdAt);
                    
                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center mb-4">
                            <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${msg.senderType === 'user' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`
                              max-w-[80%] sm:max-w-[70%] md:max-w-md px-4 py-3 rounded-lg text-sm
                              ${msg.senderType === 'user' 
                                ? 'bg-muted text-foreground rounded-bl-none shadow-sm' 
                                : 'bg-primary text-primary-foreground rounded-br-none'
                              }
                            `}
                          >
                            <p>{msg.content}</p>
                            {msg.attachment && (
                              <div className="mt-2 p-2 bg-background/20 rounded text-xs">
                                📎 {msg.attachment.name}
                              </div>
                            )}
                            <div className={`flex items-center space-x-1 mt-2 ${msg.senderType === 'user' ? 'justify-start' : 'justify-end'}`}>
                              <span className={`text-xs ${msg.senderType === 'user' ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                                {formatTime(msg.createdAt)}
                              </span>
                              {msg.senderType !== 'user' && (
                                <CheckCircle2 className="w-3 h-3 text-primary-foreground/70" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mb-4" />
                  <p>No messages in this conversation yet.</p>
                </div>
              )}

              {/* Sending indicator */}
              {sendingMessage && (
                <div className="flex justify-end">
                  <div className="bg-primary px-4 py-3 rounded-lg rounded-br-none max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-foreground/70 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary-foreground/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary-foreground/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Fixed */}
            <div className="bg-card border-t border-border p-2 sm:p-4 flex-shrink-0">
              {!userInfo ? (
                <div className="text-center text-muted-foreground">
                  <p>Please login to send messages</p>
                </div>
              ) : (
                <>
                  {selectedFile && (
                    <div className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between">
                      <span className="text-sm text-foreground">📎 {selectedFile.name}</span>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
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
                      placeholder="Type your response..."
                      disabled={sendingMessage}
                      className="flex-1 min-w-0 px-3 py-2 text-sm border border-input bg-background text-foreground rounded-full focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={(!message.trim() && !selectedFile) || sendingMessage}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground rounded-full flex items-center justify-center transition-colors shrink-0"
                    >
                      {sendingMessage ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          /* No Ticket Selected */
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center p-4">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Select a Support Ticket</h3>
              <p className="text-muted-foreground">Choose a ticket from the sidebar to start responding to customer inquiries.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportManagementPage;