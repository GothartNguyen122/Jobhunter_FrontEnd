import React, { useEffect, useState } from 'react';
import { ChatBox, ChatButton } from './index';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      // Khóa scroll nền khi mở chatbox
      body.style.overflow = 'hidden';
      // Tránh nhảy layout trên iOS/Safari khi ẩn scrollbar
      body.style.touchAction = 'none';
    } else {
      // Khôi phục scroll khi đóng chatbox
      body.style.overflow = '';
      body.style.touchAction = '';
    }

    return () => {
      // Cleanup khi unmount
      body.style.overflow = '';
      body.style.touchAction = '';
    }
  }, [isOpen]);

  return (
    <>
      <ChatButton onClick={toggleChat} isOpen={isOpen} />
      <ChatBox isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatWidget;
