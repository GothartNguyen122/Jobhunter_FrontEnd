import React, { useState, useRef, useEffect } from 'react';
import { SendOutlined, RobotOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './ChatBox.module.scss';
import chatService, { ChatMessage } from './chatService';
import { useAppSelector } from '@/redux/hooks';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  userInfo?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isOpen, onClose }) => {
  // Lấy thông tin user từ Redux store
  const user = useAppSelector(state => state.account.user);
  const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
  
  // Tạo greeting message dựa trên thông tin user
  const getGreetingMessage = () => {
    if (isAuthenticated && user?.name) {
      return `Xin chào ${user.name}! Tôi là AI Assistant của JobHunter. Tôi có thể giúp bạn tìm việc làm phù hợp, tư vấn về CV, hoặc trả lời các câu hỏi về nghề nghiệp. Bạn cần hỗ trợ gì?`;
    }
    return 'Xin chào! Tôi là AI Assistant của JobHunter. Tôi có thể giúp bạn tìm việc làm phù hợp, tư vấn về CV, hoặc trả lời các câu hỏi về nghề nghiệp. Bạn cần hỗ trợ gì?';
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: getGreetingMessage(),
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Cập nhật greeting message khi user thay đổi
  useEffect(() => {
    if (isOpen) {
      const newGreeting = getGreetingMessage();
      setMessages(prev => {
        const updatedMessages = [...prev];
        if (updatedMessages.length > 0 && updatedMessages[0].sender === 'bot') {
          updatedMessages[0] = {
            ...updatedMessages[0],
            text: newGreeting
          };
        }
        return updatedMessages;
      });
    }
  }, [isOpen, user, isAuthenticated]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      userInfo: isAuthenticated && user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.name
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Call AI service với thông tin user
      const userInfo = isAuthenticated && user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      } : undefined;
      
      const response = await chatService.sendMessage(currentInput, userInfo);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        timestamp: new Date(response.timestamp)
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const cannotConnect = (error as any)?.message === 'AI_SERVER_UNREACHABLE';
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: cannotConnect ? 'Không thể kết nối đến server.' : 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.chatboxOverlay}>
      <div className={styles.chatboxContainer}>
        <div className={styles.chatboxHeader}>
          <div className={styles.botInfo}>
            <div className={styles.botAvatar}>
              <RobotOutlined />
            </div>
            <div className={styles.botDetails}>
              <h3>JobHunter AI Assistant</h3>
              <span className={styles.status}>Đang hoạt động</span>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.botMessage
              }`}
            >
              <div className={styles.messageAvatar}>
                {message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
              </div>
              <div className={styles.messageContent}>
                {message.sender === 'user' && message.userInfo && (
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{message.userInfo.name}</span>
                    {message.userInfo.role && (
                      <span className={styles.userRole}>({message.userInfo.role})</span>
                    )}
                  </div>
                )}
                <div className={styles.messageText}>{message.text}</div>
                <div className={styles.messageTime}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <div className={styles.messageAvatar}>
                <RobotOutlined />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn của bạn..."
              className={styles.messageInput}
              maxLength={500}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={styles.sendButton}
            >
              <SendOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
