import React, { useState } from 'react';
import { Upload, Button, Card, Typography, Spin, Alert, Table, Tag, Space, Modal, message } from 'antd';
import { InboxOutlined, FileTextOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { callExtractPDF, callExtractMultiplePages, callGetPDFConfig } from '@/config/api';
import type { UploadFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;
const { Title, Text } = Typography;

interface ExtractedData {
  full_name?: string;
  objective?: string;
  phone_number?: string;
  email?: string;
  github?: string;
  university?: string;
  technical_skills?: string[];
  certificate?: string;
  projects?: Array<{
    project_name: string;
    languages: string[];
    description: string;
    team_size: number;
    role: string;
    duration: string;
  }>;
}

interface PDFExtractorProps {
  onExtractComplete?: (data: ExtractedData) => void;
  onClose?: () => void;
}

const PDFExtractor: React.FC<PDFExtractorProps> = ({ onExtractComplete, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [config, setConfig] = useState<any>(null);

  // Load PDF extractor configuration
  React.useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await callGetPDFConfig();
        if (response.data.success) {
          setConfig(response.data.data);
        }
      } catch (error) {
        console.error('Error loading PDF config:', error);
      }
    };
    loadConfig();
  }, []);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setExtractedData(null);

    try {
      const response = await callExtractPDF(file, 0);
      
      if (response.data.success) {
        const data = response.data.data.extractedData;
        setExtractedData(data);
        message.success('Trích xuất PDF thành công!');
        
        if (onExtractComplete) {
          onExtractComplete(data);
        }
      } else {
        message.error('Không thể trích xuất dữ liệu từ PDF');
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      message.error('Lỗi khi trích xuất PDF. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleMultiplePages = async (file: File) => {
    setLoading(true);
    setExtractedData(null);

    try {
      const response = await callExtractMultiplePages(file, 3);
      
      if (response.data.success) {
        const data = response.data.data.extractedData;
        setExtractedData(data);
        message.success('Trích xuất nhiều trang PDF thành công!');
        
        if (onExtractComplete) {
          onExtractComplete(data);
        }
      } else {
        message.error('Không thể trích xuất dữ liệu từ PDF');
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      message.error('Lỗi khi trích xuất PDF. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf,.png,.jpg,.jpeg,.gif,.bmp,.webp',
    beforeUpload: (file: File) => {
      handleUpload(file);
      return false; // Prevent auto upload
    },
    fileList,
    onChange: (info: any) => {
      setFileList(info.fileList);
    },
    onRemove: () => {
      setFileList([]);
      setExtractedData(null);
    }
  };

  const projectColumns = [
    {
      title: 'Tên dự án',
      dataIndex: 'project_name',
      key: 'project_name',
    },
    {
      title: 'Công nghệ',
      dataIndex: 'languages',
      key: 'languages',
      render: (languages: string[]) => (
        <Space wrap>
          {languages.map((lang, index) => (
            <Tag key={index} color="blue">{lang}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>PDF Extractor - Trích xuất thông tin CV</Title>
      
      {config && (
        <Alert
          message="Cấu hình PDF Extractor"
          description={`Hỗ trợ các định dạng: ${config.supportedFormats?.join(', ')}. Kích thước tối đa: ${Math.round(config.maxFileSize / 1024 / 1024)}MB`}
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      <Card title="Upload PDF/Image" style={{ marginBottom: '20px' }}>
        <Dragger {...uploadProps} disabled={loading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Kéo thả file PDF hoặc click để chọn</p>
          <p className="ant-upload-hint">
            Hỗ trợ PDF, PNG, JPG, JPEG, GIF, BMP, WEBP
          </p>
        </Dragger>

        {loading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '10px' }}>
              <Text>Đang trích xuất dữ liệu từ PDF...</Text>
            </div>
          </div>
        )}
      </Card>

      {extractedData && (
        <Card title="Kết quả trích xuất" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* Thông tin cá nhân */}
            <div>
              <Title level={4}>Thông tin cá nhân</Title>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {extractedData.full_name && (
                  <div><strong>Tên:</strong> {extractedData.full_name}</div>
                )}
                {extractedData.email && (
                  <div><strong>Email:</strong> {extractedData.email}</div>
                )}
                {extractedData.phone_number && (
                  <div><strong>Số điện thoại:</strong> {extractedData.phone_number}</div>
                )}
                {extractedData.github && (
                  <div><strong>GitHub:</strong> <a href={extractedData.github} target="_blank" rel="noopener noreferrer">{extractedData.github}</a></div>
                )}
                {extractedData.university && (
                  <div><strong>Trường đại học:</strong> {extractedData.university}</div>
                )}
                {extractedData.certificate && (
                  <div><strong>Chứng chỉ:</strong> {extractedData.certificate}</div>
                )}
              </div>
            </div>

            {/* Mục tiêu nghề nghiệp */}
            {extractedData.objective && (
              <div>
                <Title level={4}>Mục tiêu nghề nghiệp</Title>
                <Text>{extractedData.objective}</Text>
              </div>
            )}

            {/* Kỹ năng kỹ thuật */}
            {extractedData.technical_skills && extractedData.technical_skills.length > 0 && (
              <div>
                <Title level={4}>Kỹ năng kỹ thuật</Title>
                <Space wrap>
                  {extractedData.technical_skills.map((skill, index) => (
                    <Tag key={index} color="green">{skill}</Tag>
                  ))}
                </Space>
              </div>
            )}

            {/* Dự án */}
            {extractedData.projects && extractedData.projects.length > 0 && (
              <div>
                <Title level={4}>Dự án</Title>
                <Table
                  dataSource={extractedData.projects}
                  columns={projectColumns}
                  pagination={false}
                  size="small"
                  rowKey={(record, index) => index?.toString() || '0'}
                />
              </div>
            )}
          </Space>
        </Card>
      )}

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <Space>
          <Button onClick={onClose}>
            Đóng
          </Button>
          {extractedData && (
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={() => {
                const dataStr = JSON.stringify(extractedData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'extracted_data.json';
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Tải xuống JSON
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};

export default PDFExtractor;
