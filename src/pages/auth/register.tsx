import { Button, Divider, Form, Input,InputNumber, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import styles from 'styles/auth.module.scss';
import { IUser } from '@/types/backend';
import oauth2Service from '@/services/oauth2Service';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [isOAuth2Loading, setIsOAuth2Loading] = useState(false);

    const onFinish = async (values: any) => {
        const { name, email, password, age } = values;
        setIsSubmit(true);
        const res = await callRegister(name, email, password as string, +age);
        setIsSubmit(false);
        if (res?.data?.id) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    // Xử lý đăng ký Google
    const handleGoogleRegister = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
            notification.error({
                message: 'Lỗi cấu hình!',
                description: 'Thiếu cấu hình VITE_GOOGLE_CLIENT_ID.',
                duration: 5,
            });
            return;
        }

        setIsOAuth2Loading(true);
        const redirectUri = `${window.location.origin}/auth/callback`;
        const scope = 'openid email profile';
        const responseType = 'code';
        const state = 'register_' + Math.random().toString(36).substring(7);
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `scope=${encodeURIComponent(scope)}&` +
            `response_type=${responseType}&` +
            `state=${state}`;

        window.location.href = authUrl;
    };

    return (
        <div className={styles["register-page"]} >
            <main className={styles.main} >
                <div className={styles.container} >
                    <section className={styles.wrapper} >
                        <div className={styles.heading} >
                            <h2 className={`${styles.text} ${styles["text-large"]}`}> Đăng Ký Tài Khoản </h2>
                            < Divider />
                        </div>
                        < Form<IUser>
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Họ tên"
                                name="name"
                                rules={[
                                    { required: true, message: 'Họ tên không được để trống!' },
                                    { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
                                    { max: 50, message: 'Họ tên không được quá 50 ký tự!' }
                                ]}
                            >
                                <Input placeholder="Nhập họ tên" />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: 'email', message: 'Email không đúng định dạng!' }
                                ]}
                            >
                                <Input type='email' placeholder="Nhập email" />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    { required: true, message: 'Mật khẩu không được để trống!' },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                ]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu" />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tuổi"
                                name="age"
                                rules={[
                                    { required: true, message: 'Tuổi không được để trống!' },
                                    { type: 'number', min: 16, max: 100, message: 'Tuổi phải từ 16 đến 100!' }
                                ]}
                            >
                                <InputNumber type='number' placeholder="Nhập tuổi" />
                            </Form.Item>

                            < Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit} style={{ width: '100%', height: '40px' }}>
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider> Or </Divider>
                            
                            {/* Google Register Button */}
                            <div className={styles.socialRow}>
                                <Button
                                    onClick={handleGoogleRegister}
                                    className={`${styles.socialBtn} ${styles.google}`}
                                    size="large"
                                    block
                                    loading={isOAuth2Loading}
                                    disabled={isOAuth2Loading}
                                >
                                    <span className={styles.iconCircle}>
                                        <svg className={styles.brandIcon} viewBox="0 0 48 48" width="24px" height="24px">
                                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                            <path fill="#4285F4" d="M46.98 24c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.9 7.27l6.75 5.23c3.95-3.62 6.25-8.78 6.25-15.97z"></path>
                                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14-.76-4.59l-7.98-6.19C3.07 15.49 0 19.73 0 24s3.07 8.51 7.55 11.82l7.98-6.19z"></path>
                                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-6.75-5.23c-2.91 1.95-6.71 3.17-9.14 3.17-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                            <path fill="none" d="M0 0h48v48H0z"></path>
                                        </svg>
                                    </span>
                                    Đăng ký với Google
                                </Button>
                            </div>
                            
                            <p className="text text-normal" > Đã có tài khoản ?
                                <span>
                                    <Link to='/login' > Đăng Nhập </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage;