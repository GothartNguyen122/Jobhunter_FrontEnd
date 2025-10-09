import { Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RobotOutlined, MessageOutlined, DatabaseOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import styles from '@/styles/chatbox_admin.module.scss';

const { Sider, Content, Header } = Layout;

const ChatboxAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState('/admin/chatbox-admin/dashboard');

  useEffect(() => {
    // Sync active key from URL
    const path = location.pathname;
    setActive(path);
  }, [location.pathname]);

  const items = [
    { key: '/admin/chatbox-admin/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { key: '/admin/chatbox-admin/conversations', icon: <MessageOutlined />, label: 'Conversations' },
    { key: '/admin/chatbox-admin/rag', icon: <DatabaseOutlined />, label: 'RAG' },
    { key: '/admin/chatbox-admin/chatboxes', icon: <SettingOutlined />, label: 'Chatboxes' },
  ];

  return (
    <div className={styles.chatboxAdminRoot}>
      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        <Sider theme="dark" breakpoint="lg" className={styles.siderDark}>
          <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className={styles.logo}>
              <RobotOutlined />
            </div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[active]}
            items={items}
            onClick={(e) => navigate(e.key)}
            style={{ background: 'transparent' }}
          />
        </Sider>
        <Layout style={{ background: 'transparent' }}>
          <Header className={styles.headerBar} style={{ padding: 0 }}>
            <div className={styles.headerInner}>
              <div style={{ fontWeight: 600, letterSpacing: 0.4 }}>Chatbox Admin</div>
            </div>
          </Header>
          <Content>
            <div className={styles.contentWrap}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default ChatboxAdminLayout;


