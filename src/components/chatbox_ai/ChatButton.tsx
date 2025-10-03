import React from 'react';
import { MessageOutlined } from '@ant-design/icons';
import styles from './ChatButton.module.scss';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      className={`${styles.chatButton} ${isOpen ? styles.active : ''}`}
      onClick={onClick}
      title="Mở AI Assistant"
    >
      <div className={styles.chatIcon}>
        <MessageOutlined />
      </div>
      <div className={styles.pulseRing}></div>
      <div className={styles.pulseRing2}></div>
    </button>
  );
};

export default ChatButton;
