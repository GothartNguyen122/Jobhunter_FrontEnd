import React, { useState, useRef, useEffect } from 'react';
import { SendOutlined, RobotOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './ChatBox.module.scss';
import chatService, { ChatMessage } from './chatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là AI Assistant của JobHunter. Tôi có thể giúp bạn tìm việc làm phù hợp, tư vấn về CV, hoặc trả lời các câu hỏi về nghề nghiệp. Bạn cần hỗ trợ gì?',
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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Call AI service
      const response = await chatService.sendMessage(currentInput);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        timestamp: new Date(response.timestamp)
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('việc làm') || lowerInput.includes('job') || lowerInput.includes('tuyển dụng')) {
      return 'Tôi có thể giúp bạn tìm việc làm phù hợp! Bạn có thể tìm kiếm theo ngành nghề, địa điểm, hoặc mức lương mong muốn. Bạn quan tâm đến lĩnh vực nào?';
    }
    
    if (lowerInput.includes('cv') || lowerInput.includes('resume') || lowerInput.includes('hồ sơ')) {
      return 'Tôi có thể tư vấn về cách viết CV hiệu quả! Một CV tốt nên có: thông tin cá nhân rõ ràng, kinh nghiệm làm việc chi tiết, kỹ năng phù hợp, và thành tích nổi bật. Bạn muốn tư vấn về phần nào?';
    }
    
    if (lowerInput.includes('kỹ năng') || lowerInput.includes('skill')) {
      return 'Kỹ năng là yếu tố quan trọng trong tìm việc! Các kỹ năng phổ biến hiện nay bao gồm: lập trình, marketing, quản lý dự án, ngoại ngữ... Bạn có kỹ năng nào nổi bật?';
    }
    
    if (lowerInput.includes('phỏng vấn') || lowerInput.includes('interview')) {
      return 'Chuẩn bị phỏng vấn là bước quan trọng! Tôi khuyên bạn: nghiên cứu về công ty, chuẩn bị câu trả lời cho các câu hỏi thường gặp, ăn mặc phù hợp, và tự tin. Bạn có câu hỏi cụ thể nào về phỏng vấn?';
    }
    
    return 'Cảm ơn bạn đã hỏi! Tôi là AI Assistant chuyên về tư vấn nghề nghiệp và tìm việc làm. Bạn có thể hỏi tôi về: tìm việc làm, viết CV, kỹ năng cần thiết, hoặc chuẩn bị phỏng vấn. Tôi có thể giúp gì thêm cho bạn?';
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
