import { useState } from 'react';
import { Card, Upload, Button, List, Typography, Space, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from '@/styles/chatbox_admin.module.scss';

interface RagDoc {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  status: 'indexed' | 'processing' | 'failed';
}

const ChatboxAdminRag = () => {
  const [docs, setDocs] = useState<RagDoc[]>([]);

  const handleUpload = (info: any) => {
    const file = info.file.originFileObj;
    const newDoc: RagDoc = {
      id: `${Date.now()}`,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: 'processing'
    };
    setDocs(prev => [newDoc, ...prev]);
    setTimeout(() => {
      setDocs(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'indexed' } : d));
    }, 1200);
  };

  const statusColor = (s: RagDoc['status']) => s === 'indexed' ? 'green' : s === 'processing' ? 'orange' : 'red';

  return (
    <div className={styles.pageRoot}>
      <Typography.Title level={3} className={styles.pageTitle}>Quản lý tài liệu RAG</Typography.Title>
      <Card className={styles.darkCard}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload beforeUpload={() => false} showUploadList={false} customRequest={handleUpload}>
            <Button icon={<UploadOutlined />}> <span className={styles.emphasis}>Tải tài liệu lên</span> </Button>
          </Upload>
          <List
            header={<div>Tài liệu đã tải lên</div>}
            dataSource={docs}
            renderItem={(d) => (
              <List.Item>
                <List.Item.Meta 
                  title={<span className={styles.listTitle}>{d.name}</span>} 
                  description={<span className={styles.listDesc}><span className={styles.numberEmphasis}>{(d.size/1024).toFixed(1)} KB</span> • {new Date(d.uploadedAt).toLocaleString('vi-VN')}</span>} 
                />
                <Tag color={statusColor(d.status)}>{d.status}</Tag>
              </List.Item>
            )}
          />
        </Space>
      </Card>
      <Card className={styles.darkCard} style={{ marginTop: 16 }} title="Huấn luyện / Indexing">
        <Space>
          <Button type="primary">Huấn luyện lại mô hình RAG</Button>
          <Button>Đồng bộ vector store</Button>
        </Space>
      </Card>
    </div>
  );
};

export default ChatboxAdminRag;


