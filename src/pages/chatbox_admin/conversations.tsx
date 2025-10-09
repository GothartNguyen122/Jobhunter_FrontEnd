import { useEffect, useState } from 'react';
import { Card, Input, List, Typography, Button } from 'antd';
import styles from '@/styles/chatbox_admin.module.scss';

interface ConversationItem {
  id: string;
  userId?: string;
  title: string;
  createdAt: string;
  lastMessage?: string;
}

const ChatboxAdminConversations = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<ConversationItem[]>([]);

  useEffect(() => {
    // TODO: fetch from Supabase later
    setData(Array.from({ length: 20 }).map((_, i) => ({
      id: `${i + 1}`,
      userId: `user-${(i % 5) + 1}`,
      title: `Cuộc trò chuyện #${i + 1}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      lastMessage: 'Tin nhắn cuối cùng...'
    })));
  }, []);

  const filtered = data.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.pageRoot}>
      <Typography.Title level={3} className={styles.pageTitle}>Lịch sử hội thoại</Typography.Title>
      <Card className={styles.darkCard}>
        <Input.Search placeholder="Tìm kiếm hội thoại" value={search} onChange={e => setSearch(e.target.value)} />
        <List
          style={{ marginTop: 16 }}
          dataSource={filtered}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="analyze" type="primary" onClick={() => alert(`Phân tích cuộc trò chuyện ${item.title}`)}>Analysis</Button>
              ]}
            >
              <List.Item.Meta
                title={<span className={styles.listTitle}>{item.title}</span>}
                description={
                  <span className={styles.listDesc}>
                    User: <span className={styles.numberEmphasis}>{item.userId}</span> •
                    {' '}{new Date(item.createdAt).toLocaleString('vi-VN')} •
                    {' '}<span className={styles.emphasis}>{item.lastMessage || 'no data'}</span>
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ChatboxAdminConversations;


