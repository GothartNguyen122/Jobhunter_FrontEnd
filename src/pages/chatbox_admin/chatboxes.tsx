import { useState, useEffect } from 'react';
import { Card, Table, Button, Switch, Typography, Tag, Space, Modal, Form, Input, message, Popconfirm, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, FileTextOutlined, RobotOutlined, CodeOutlined } from '@ant-design/icons';
import { callFetchAllChatboxes, callCreateChatbox, callUpdateChatbox, callDeleteChatbox, callToggleChatbox } from '@/config/api';
import PDFExtractor from '@/components/chatbox_ai/PDFExtractor';
import { testConnections, logConnectionStatus } from '@/utils/connectionTest';
import styles from '@/styles/chatbox_admin.module.scss';

interface ChatboxItem {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  systemPrompt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatboxFormData {
  name: string;
  description: string;
  systemPrompt: string;
  enabled: boolean;
}

const ChatboxAdminChatboxes = () => {
  const [items, setItems] = useState<ChatboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ChatboxItem | null>(null);
  const [pdfExtractorVisible, setPdfExtractorVisible] = useState(false);
  const [form] = Form.useForm();

  // Load chatboxes from API
  const loadChatboxes = async () => {
    try {
      setLoading(true);
      const response = await callFetchAllChatboxes();
      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (error) {
      message.error('Không thể tải danh sách chatbox');
      console.error('Error loading chatboxes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Test connections first
    const testConnectionsOnLoad = async () => {
      const result = await testConnections();
      logConnectionStatus(result);
      
      if (!result.aiServer) {
        message.error('Không thể kết nối đến AI Server. Vui lòng kiểm tra cấu hình.');
      }
    };
    
    testConnectionsOnLoad();
    loadChatboxes();
  }, []);

  // Handle toggle chatbox
  const handleToggle = async (id: string) => {
    try {
      const response = await callToggleChatbox(id);
      if (response.data.success) {
        message.success('Trạng thái chatbox đã được cập nhật');
        loadChatboxes(); // Reload data
      }
    } catch (error) {
      message.error('Không thể cập nhật trạng thái chatbox');
      console.error('Error toggling chatbox:', error);
    }
  };

  // Handle create/update chatbox
  const handleSubmit = async (values: ChatboxFormData) => {
    try {
      if (editingItem) {
        // Update existing chatbox
        const response = await callUpdateChatbox(editingItem.id, values);
        if (response.data.success) {
          message.success('Chatbox đã được cập nhật');
        }
      } else {
        // Create new chatbox
        const response = await callCreateChatbox(values);
        if (response.data.success) {
          message.success('Chatbox đã được tạo');
        }
      }
      setModalVisible(false);
      setEditingItem(null);
      form.resetFields();
      loadChatboxes(); // Reload data
    } catch (error) {
      message.error('Không thể lưu chatbox');
      console.error('Error saving chatbox:', error);
    }
  };

  // Handle delete chatbox
  const handleDelete = async (id: string) => {
    try {
      const response = await callDeleteChatbox(id);
      if (response.data.success) {
        message.success('Chatbox đã được xóa');
        loadChatboxes(); // Reload data
      }
    } catch (error) {
      message.error('Không thể xóa chatbox');
      console.error('Error deleting chatbox:', error);
    }
  };

  // Open modal for create/edit
  const openModal = (item?: ChatboxItem) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue({
        name: item.name,
        description: item.description || '',
        systemPrompt: item.systemPrompt || '',
        enabled: item.enabled
      });
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ChatboxItem) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          {record.description && (
            <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
          )}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: ChatboxItem) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      )
    },
    {
      title: 'Loại',
      key: 'type',
      render: (_, record: ChatboxItem) => {
        // Determine chatbox type based on ID or name
        if (record.id === 'default') {
          return <Tag color="blue">Default AI</Tag>;
        } else if (record.name.toLowerCase().includes('pdf')) {
          return <Tag color="orange">PDF Extractor</Tag>;
        } else if (record.name.toLowerCase().includes('widget')) {
          return <Tag color="purple">Widget</Tag>;
        } else {
          return <Tag color="cyan">Custom</Tag>;
        }
      }
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record: ChatboxItem) => (
        <Space>
          <Switch 
            checked={record.enabled} 
            onChange={() => handleToggle(record.id)}
            size="small"
          />
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => openModal(record)}
          >
            Sửa
          </Button>
          <Button 
            icon={<SettingOutlined />} 
            size="small"
            onClick={() => message.info('Tính năng cấu hình chi tiết sẽ được phát triển')}
          >
            Cấu hình
          </Button>
          {record.id !== 'default' && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa chatbox này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button 
                icon={<DeleteOutlined />} 
                size="small" 
                danger
              >
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  const tabItems = [
    {
      key: 'chatboxes',
      label: (
        <span>
          <RobotOutlined />
          Quản lý Chatbox
        </span>
      ),
      children: (
        <Card className={styles.darkCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Danh sách Chatbox
            </Typography.Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => openModal()}
            >
              Thêm Chatbox
            </Button>
          </div>
          <Table
            rowKey="id"
            dataSource={items}
            columns={columns}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chatbox`
            }}
          />
        </Card>
      )
    },
    {
      key: 'pdf-extractor',
      label: (
        <span>
          <FileTextOutlined />
          PDF Extractor
        </span>
      ),
      children: (
        <Card className={styles.darkCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Trích xuất thông tin từ PDF
            </Typography.Title>
            <Button 
              type="primary" 
              icon={<FileTextOutlined />}
              onClick={() => setPdfExtractorVisible(true)}
            >
              Mở PDF Extractor
            </Button>
          </div>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Typography.Title level={4}>PDF Extractor</Typography.Title>
            <Typography.Text type="secondary">
              Trích xuất thông tin từ CV/Resume PDF một cách tự động
            </Typography.Text>
            <br />
            <Button 
              type="primary" 
              size="large"
              icon={<FileTextOutlined />}
              onClick={() => setPdfExtractorVisible(true)}
              style={{ marginTop: '16px' }}
            >
              Bắt đầu trích xuất
            </Button>
          </div>
        </Card>
      )
    },
    {
      key: 'widget',
      label: (
        <span>
          <CodeOutlined />
          Widget Chat
        </span>
      ),
      children: (
        <Card className={styles.darkCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Widget Chat
            </Typography.Title>
            <Button 
              type="primary" 
              icon={<CodeOutlined />}
              onClick={() => message.info('Tính năng Widget Chat sẽ được phát triển')}
            >
              Cấu hình Widget
            </Button>
          </div>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <CodeOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <Typography.Title level={4}>Widget Chat</Typography.Title>
            <Typography.Text type="secondary">
              Tích hợp chatbox vào website của bạn
            </Typography.Text>
            <br />
            <Button 
              type="primary" 
              size="large"
              icon={<CodeOutlined />}
              onClick={() => message.info('Tính năng Widget Chat sẽ được phát triển')}
              style={{ marginTop: '16px' }}
            >
              Cấu hình Widget
            </Button>
          </div>
        </Card>
      )
    }
  ];

  return (
    <div className={styles.pageRoot}>
      <Typography.Title level={3} className={styles.pageTitle}>
        Hệ quản trị Chatbox
      </Typography.Title>
      
      <Tabs defaultActiveKey="chatboxes" items={tabItems} />

      <Modal
        title={editingItem ? 'Chỉnh sửa Chatbox' : 'Thêm Chatbox mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên Chatbox"
            rules={[{ required: true, message: 'Vui lòng nhập tên chatbox' }]}
          >
            <Input placeholder="Nhập tên chatbox" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea 
              placeholder="Mô tả chức năng của chatbox"
              rows={2}
            />
          </Form.Item>

          <Form.Item
            name="systemPrompt"
            label="System Prompt"
            rules={[{ required: true, message: 'Vui lòng nhập system prompt' }]}
          >
            <Input.TextArea 
              placeholder="Nhập system prompt cho AI"
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="PDF Extractor"
        open={pdfExtractorVisible}
        onCancel={() => setPdfExtractorVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <PDFExtractor 
          onExtractComplete={(data) => {
            console.log('Extracted data:', data);
            message.success('Dữ liệu đã được trích xuất thành công!');
          }}
          onClose={() => setPdfExtractorVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default ChatboxAdminChatboxes;


