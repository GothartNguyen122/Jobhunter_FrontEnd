import { Card, Col, Row, Statistic, Typography, Input, Button, Tag, List } from 'antd';
import { BarChartOutlined, DatabaseOutlined, FolderOpenOutlined, RocketOutlined, SearchOutlined, RobotOutlined } from '@ant-design/icons';
import styles from '@/styles/chatbox_admin.module.scss';

const ChatboxAdminDashboard = () => {
  const activityData = Array.from({ length: 14 }).map((_, i) => ({ x: `Day ${i + 1}`, y: Math.round(Math.random() * 100) + 20 }));
  const quickStats = [
    { label: 'Người dùng hôm nay', value: 128, color: '#22d3ee' },
    { label: 'Hội thoại đang mở', value: 46, color: '#52c41a' },
    { label: 'Tỷ lệ thành công', value: '93%', color: '#faad14' },
    { label: 'Tài liệu RAG', value: 57, color: '#722ed1' },
  ];
  const recentConversations = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    title: `Cuộc trò chuyện #${i + 1}`,
    user: `user-${(i % 4) + 1}`,
    summary: 'Tư vấn công việc, xem JD phù hợp...'
  }));

  return (
    <div className={styles.pageRoot}>
      <Typography.Title level={3} className={styles.pageTitle}>Tổng quan Chatbox</Typography.Title>
      <Row gutter={[16, 16]}>
        {quickStats.map((s, idx) => (
          <Col xs={24} md={6} key={idx}>
            <Card className={styles.darkCard}>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className={styles.sectionGap}>
        <Col xs={24} md={16}>
          <Card title="Biểu đồ hoạt động theo thời gian" className={styles.darkCard}>
            <div className={styles.barChart}>
              {activityData.map((d, idx) => (
                <div key={idx} className={styles.barTrack}>
                  <div className={styles.barFill} style={{ height: `${d.y * 2}px` }} />
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><DatabaseOutlined /> RAG nhanh</span>} className={styles.darkCard}>
            <div className={styles.listDesc} style={{ marginBottom: 12 }}>Quản lý tài liệu được index</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Button icon={<FolderOpenOutlined />}>Tài liệu</Button>
              <Button icon={<RocketOutlined />} type="primary">Huấn luyện</Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.sectionGap}>
        <Col xs={24}>
          <Card title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BarChartOutlined /> Hoạt động gần đây</span>} className={styles.darkCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className={styles.listDesc}>Tóm tắt những tương tác mới nhất</div>
              <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm..." allowClear style={{ width: 260 }} />
            </div>
            <List
              itemLayout="horizontal"
              dataSource={recentConversations}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<span className={styles.listTitle}>{item.title} <Tag color="processing" style={{ marginLeft: 8 }}><span className={styles.numberEmphasis}>{item.user}</span></Tag></span>}
                    description={<span className={styles.listDesc}>{item.summary}</span>}
                  />
                  <Button type="link">Mở</Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChatboxAdminDashboard;


