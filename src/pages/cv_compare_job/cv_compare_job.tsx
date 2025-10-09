import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Card, Tag, Skeleton, Divider, Typography, Alert, List, Badge, Tooltip } from 'antd';
import { BulbOutlined, CheckCircleOutlined, ExclamationCircleOutlined, StarOutlined, RocketOutlined } from '@ant-design/icons';
import styles from 'styles/client.module.scss';
import { callFetchJobById } from '@/config/api';
import { IJob } from '@/types/backend';
import parse from 'html-react-parser';

interface CompareData {
  job: {
    name?: string;
    description?: string;
    skills?: { name: string }[];
    experience?: string;
    level?: string;
    degree?: string;
  };
  cv: {
    summary?: string;
    skills?: string[];
    experience?: string;
    projects?: string[];
    degree?: string;
  };
  keywords?: string[];
}

interface ImprovementSuggestion {
  id: string;
  category: 'skill' | 'experience' | 'format' | 'content';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
}

// Sample AI suggestions for demonstration
const sampleSuggestions: ImprovementSuggestion[] = [
  {
    id: '1',
    category: 'skill',
    priority: 'high',
    title: 'Bổ sung kỹ năng lập trình Python',
    description: 'JD yêu cầu Python nhưng CV chưa đề cập. Đây là kỹ năng quan trọng cho vị trí này.',
    action: 'Thêm Python vào phần kỹ năng và mô tả kinh nghiệm sử dụng Python trong các dự án.',
    impact: 'Tăng 25% độ phù hợp với JD'
  },
  {
    id: '2',
    category: 'experience',
    priority: 'high',
    title: 'Làm nổi bật kinh nghiệm quản lý dự án',
    description: 'Bạn có kinh nghiệm quản lý nhưng chưa được thể hiện rõ ràng trong CV.',
    action: 'Thêm số liệu cụ thể: "Quản lý team 5 người, tăng hiệu suất 30%"',
    impact: 'Tăng 20% độ phù hợp với JD'
  },
  {
    id: '3',
    category: 'content',
    priority: 'medium',
    title: 'Cải thiện phần tóm tắt cá nhân',
    description: 'Tóm tắt hiện tại chưa nêu bật giá trị cốt lõi phù hợp với vị trí.',
    action: 'Viết lại tóm tắt tập trung vào kinh nghiệm 3+ năm và kỹ năng lãnh đạo.',
    impact: 'Tăng 15% độ phù hợp với JD'
  },
  {
    id: '4',
    category: 'format',
    priority: 'low',
    title: 'Tối ưu hóa từ khóa',
    description: 'Thêm các từ khóa quan trọng từ JD vào CV.',
    action: 'Sử dụng từ khóa: "Agile", "Scrum", "Team Leadership" trong mô tả kinh nghiệm.',
    impact: 'Tăng 10% độ phù hợp với JD'
  }
];

// (Tạm thời) Không gọi API compare cho phần JD; chỉ lấy thông tin JD từ Job

const CvCompareJobPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const jobId = params.get('id') || '';

  const [loading, setLoading] = useState<boolean>(true);
  const [jobDetail, setJobDetail] = useState<IJob | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setErr(null);
      try {
        if (!jobId) {
          setErr('Thiếu tham số id công việc.');
          setLoading(false);
          return;
        }
        const res = await callFetchJobById(jobId);
        if (res?.data) {
          setJobDetail(res.data as unknown as IJob);
        } else {
          setErr('Không thể tải thông tin công việc.');
        }
      } catch (e) {
        setErr('Không thể tải thông tin công việc.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [jobId]);

  const renderSkillTags = (skills?: any) => {
    if (!skills || skills.length === 0) return <i>Không có dữ liệu</i>;
    if (Array.isArray(skills) && typeof skills[0] === 'string') {
      return (skills as string[]).map((s, i) => <Tag key={i} color="gold">{s}</Tag>);
    }
    return (skills as { name: string }[]).map((s, i) => <Tag key={i} color="gold">{s.name}</Tag>);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#fa8c16';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'skill': return <StarOutlined />;
      case 'experience': return <CheckCircleOutlined />;
      case 'format': return <ExclamationCircleOutlined />;
      case 'content': return <BulbOutlined />;
      default: return <BulbOutlined />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'skill': return '#1890ff';
      case 'experience': return '#52c41a';
      case 'format': return '#fa8c16';
      case 'content': return '#722ed1';
      default: return '#d9d9d9';
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["company-detail-wrapper"]}>
        <div className={styles["company-detail-section"]}>
          <h3 className={styles["company-detail-section-title"]}>So sánh CV với JD: {jobDetail?.name || '—'}</h3>
          {err && <Alert type="error" message={err} style={{ marginBottom: 16 }} />}
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              <Card style={{ marginBottom: 16 }}>
                <Typography.Title level={5} style={{ marginTop: 0 }}>Những thành phần quan trọng của một CV hiệu quả</Typography.Title>
                <ul style={{ marginBottom: 0 }}>
                  <li>Tóm tắt cá nhân súc tích, nêu bật giá trị cốt lõi</li>
                  <li>Kỹ năng liên quan trực tiếp đến JD (kỹ thuật và mềm)</li>
                  <li>Kinh nghiệm nổi bật, có số liệu/đóng góp rõ ràng</li>
                  <li>Dự án tiêu biểu, thể hiện kỹ năng liên quan</li>
                  <li>Trình độ học vấn/chứng chỉ phù hợp</li>
                  <li>Các từ khóa quan trọng trùng khớp JD</li>
                </ul>
                {jobDetail?.skills && jobDetail.skills.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <span style={{ fontWeight: 600 }}>Từ khóa gợi ý từ JD: </span>
                    {jobDetail.skills.map((s: any, i: number) => <Tag key={i} color="processing">{s.name}</Tag>)}
                  </div>
                )}
              </Card>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="Job Description (JD)">
                    <div style={{ marginBottom: 12 }}>
                      <Typography.Text strong>Mô tả công việc</Typography.Text>
                      <div style={{ marginTop: 6 }}>{jobDetail?.description ? parse(jobDetail.description) : <i>Không có dữ liệu</i>}</div>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ marginBottom: 12 }}>
                      <Typography.Text strong>Kỹ năng yêu cầu</Typography.Text>
                      <div style={{ marginTop: 6 }}>{renderSkillTags(jobDetail?.skills)}</div>
                    </div>
                    {/* Kinh nghiệm có thể không có trong IJob; sẽ bổ sung sau nếu backend cung cấp */}
                    <Divider style={{ margin: '12px 0' }} />
                    <Row gutter={8}>
                      <Col span={12}>
                        <Typography.Text strong>Cấp độ</Typography.Text>
                        <div style={{ marginTop: 6 }}>{jobDetail?.level || <i>—</i>}</div>
                      </Col>
                      <Col span={12}>
                        <Typography.Text strong>Trình độ</Typography.Text>
                        <div style={{ marginTop: 6 }}>{(jobDetail as any)?.degree || <i>—</i>}</div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="CV của bạn">
                    <div style={{ marginBottom: 12 }}>
                      <Typography.Text strong>Tóm tắt</Typography.Text>
                      <div style={{ marginTop: 6 }}><i>Sẽ trích xuất từ CV người dùng.</i></div>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ marginBottom: 12 }}>
                      <Typography.Text strong>Kỹ năng</Typography.Text>
                      <div style={{ marginTop: 6 }}><i>Sẽ trích xuất từ CV người dùng.</i></div>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ marginBottom: 12 }}>
                      <Typography.Text strong>Kinh nghiệm</Typography.Text>
                      <div style={{ marginTop: 6 }}><i>Sẽ trích xuất từ CV người dùng.</i></div>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ marginBottom: 12 }}>
                      <Typography.Text strong>Dự án</Typography.Text>
                      <div style={{ marginTop: 6 }}><i>Sẽ trích xuất từ CV người dùng.</i></div>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <Row gutter={8}>
                      <Col span={12}>
                        <Typography.Text strong>Trình độ</Typography.Text>
                        <div style={{ marginTop: 6 }}><i>Sẽ trích xuất từ CV người dùng.</i></div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              {/* Đề xuất cải thiện */}
              <div className={styles["company-detail-section"]} style={{ marginTop: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                  <RocketOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 12 }} />
                  <Typography.Title level={3} style={{ margin: 0, color: '#1a2980' }}>
                    Đề xuất cải thiện
                  </Typography.Title>
                  <Badge count={sampleSuggestions.length} style={{ marginLeft: 12, backgroundColor: '#52c41a' }} />
                </div>

                <Card 
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    color: 'white',
                    marginBottom: 24
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    <BulbOutlined style={{ fontSize: 20, marginRight: 8 }} />
                    <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
                      AI Phân tích thông minh
                    </Typography.Title>
                  </div>
                  <Typography.Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                    Dựa trên việc so sánh JD và CV của bạn, AI đã phân tích và đưa ra các đề xuất cải thiện 
                    để tăng độ phù hợp với công việc. Hãy thực hiện theo thứ tự ưu tiên để đạt hiệu quả tốt nhất.
                  </Typography.Text>
                </Card>

                <List
                  dataSource={sampleSuggestions}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Card 
                        style={{ 
                          width: '100%',
                          border: `2px solid ${getPriorityColor(item.priority)}20`,
                          borderRadius: 12,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        bodyStyle={{ padding: '20px' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <div 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                width: 40, 
                                height: 40, 
                                borderRadius: '50%', 
                                backgroundColor: `${getCategoryColor(item.category)}20`,
                                marginRight: 16
                              }}
                            >
                              <span style={{ color: getCategoryColor(item.category), fontSize: 18 }}>
                                {getCategoryIcon(item.category)}
                              </span>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                <Typography.Title level={4} style={{ margin: 0, marginRight: 12 }}>
                                  {item.title}
                                </Typography.Title>
                                <Tooltip title={`Độ ưu tiên: ${item.priority.toUpperCase()}`}>
                                  <Badge 
                                    color={getPriorityColor(item.priority)} 
                                    text={
                                      <span style={{ 
                                        color: getPriorityColor(item.priority), 
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        fontSize: 12
                                      }}>
                                        {item.priority === 'high' ? 'Cao' : item.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                      </span>
                                    } 
                                  />
                                </Tooltip>
                              </div>
                              <Typography.Text style={{ color: '#666', fontSize: 14 }}>
                                {item.description}
                              </Typography.Text>
                            </div>
                          </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <Typography.Text strong style={{ color: '#1890ff', display: 'block', marginBottom: 8 }}>
                            💡 Hành động đề xuất:
                          </Typography.Text>
                          <Typography.Text style={{ color: '#333', fontSize: 14, lineHeight: 1.6 }}>
                            {item.action}
                          </Typography.Text>
                        </div>

                        <div style={{ 
                          padding: '12px 16px', 
                          backgroundColor: '#f6ffed', 
                          borderRadius: 8, 
                          border: '1px solid #b7eb8f',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                          <Typography.Text strong style={{ color: '#52c41a' }}>
                            Tác động: {item.impact}
                          </Typography.Text>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />

                <Card style={{ marginTop: 24, background: '#f9f9f9', border: '1px solid #d9d9d9' }}>
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Typography.Title level={4} style={{ color: '#1a2980', marginBottom: 12 }}>
                      🎯 Lời khuyên từ AI
                    </Typography.Title>
                    <Typography.Text style={{ color: '#666', fontSize: 16, lineHeight: 1.6 }}>
                      Thực hiện các đề xuất theo thứ tự ưu tiên sẽ giúp bạn tăng đáng kể cơ hội được tuyển dụng. 
                      Hãy bắt đầu với những đề xuất có độ ưu tiên cao nhất để đạt hiệu quả tối đa.
                    </Typography.Text>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CvCompareJobPage;


