import { useState } from 'react';
import { Card, Table, Button, Switch, Typography } from 'antd';
import styles from '@/styles/chatbox_admin.module.scss';

interface ChatboxItem {
  id: string;
  name: string;
  route: string;
  active: boolean;
}

const ChatboxAdminChatboxes = () => {
  const [items, setItems] = useState<ChatboxItem[]>([
    { id: '1', name: 'JobHunter AI Assistant', route: '/', active: true },
  ]);

  return (
    <div className={styles.pageRoot}>
      <Typography.Title level={3} className={styles.pageTitle}>Quản lý Chatbox</Typography.Title>
      <Card className={styles.darkCard}>
        <Table
          rowKey="id"
          dataSource={items}
          columns={[
            { title: 'Tên', dataIndex: 'name' },
            { title: 'Route', dataIndex: 'route', render: (v) => (<span className={styles.numberEmphasis}>{v}</span>) },
            { title: 'Kích hoạt', dataIndex: 'active', render: (v, r) => (
              <Switch checked={v} onChange={(val) => setItems(prev => prev.map(i => i.id === r.id ? { ...i, active: val } : i))} />
            )},
            { title: 'Hành động', render: (_, r) => (
              <Button onClick={() => alert(`Cấu hình chatbox ${r.name}`)}>Cấu hình</Button>
            )}
          ]}
        />
      </Card>
    </div>
  );
};

export default ChatboxAdminChatboxes;


