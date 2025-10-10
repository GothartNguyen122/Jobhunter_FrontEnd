import { Button, Divider, Form, Input, message, notification, Checkbox, Spin } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from 'config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';
import oauth2Service from '@/services/oauth2Service';

// Helper function to determine redirect path based on user role
const getRedirectPath = (user: any, callback?: string | null) => {
    if (callback) {
        return callback;
    }
    
    // Check if user has admin/HR role
    const isAdmin = user?.role?.name === 'ADMIN' || user?.role?.name === 'SUPER_ADMIN';
    const isHR = user?.role?.name === 'HR';
    const hasAdminPermissions = user?.role?.permissions?.length > 0;
    
    if (isAdmin || isHR || hasAdminPermissions) {
        return '/admin';
    }
    
    return '/';
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [isOAuth2Loading, setIsOAuth2Loading] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");

    useEffect(() => {
        //đã login => redirect to '/'
        if (isAuthenticated) {
            // navigate('/');
            window.location.href = '/';
        }
        
        // Xử lý OAuth2 error
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error === 'true') {
            notification.error({
                message: "Đăng nhập thất bại!",
                description: "Đăng nhập bằng Google thất bại. Vui lòng thử lại.",
                duration: 5
            });
        }
    }, [])

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        try {
            const res = await callLogin(username, password);
            setIsSubmit(false);

            if (res?.data) {
                localStorage.setItem('access_token', res.data.access_token);
                dispatch(setUserLoginInfo(res.data.user));
                message.success('Đăng nhập tài khoản thành công!');
                
                // Determine redirect path based on user role
                const redirectPath = getRedirectPath(res.data.user, callback);
                window.location.href = redirectPath;
            } else {
                notification.error({
                    message: "Đăng nhập thất bại!",
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5
                });
            }
        } catch (error: any) {
            setIsSubmit(false);
            let backendMsg = error?.response?.data?.message;
            let userMsg = "Có lỗi xảy ra, vui lòng thử lại.";
            if (backendMsg === "Bad credentials") {
                userMsg = "Tài khoản hoặc mật khẩu không đúng!";
            } else if (backendMsg) {
                userMsg = backendMsg;
            }
            notification.error({
                message: "Đăng nhập thất bại!",
                description: userMsg,
                duration: 5
            });
        }
    };


        // Xử lý đăng nhập Google: mở URL ủy quyền (Authorization Code)
        const handleGoogleLogin = async () => {
            try {
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
                if (!clientId) {
                    notification.error({ message: 'Thiếu cấu hình', description: 'VITE_GOOGLE_CLIENT_ID chưa được cấu hình.' });
                    return;
                }
                const redirectUri = `${window.location.origin}/auth/callback`;
                const state = Math.random().toString(36).slice(2);
                const scope = encodeURIComponent('openid email profile');
                const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;
                window.location.href = authUrl;
            } catch (e) {
                notification.error({
                    message: 'Đăng nhập thất bại!',
                    description: 'Không thể khởi tạo đăng nhập Google',
                })
            }
        };


    // Xử lý đăng nhập Facebook
    const handleFacebookLogin = async () => {
        setIsOAuth2Loading(true);
        try {
            // TODO: Implement Facebook OAuth2
            notification.info({
                message: "Tính năng sắp ra mắt!",
                description: "Đăng nhập bằng Facebook sẽ có sớm.",
                duration: 3
            });
        } finally {
            setIsOAuth2Loading(false);
        }
    };


    return (
        <div className={styles["login-layout"]}>
            <div className={styles["login-banner"]}>
                <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=90"
                    alt="IT Banner"
                    className={styles["banner-img"]}
                />
                <div className={styles["banner-overlay"]}></div>
            </div>
            <div className={styles["login-form-block"]}>
                <div className={styles["login-info"]}>
                    {/* Đã xóa slogan, chỉ giữ lại các thành phần cần thiết */}
                </div>
                <main className={styles.main}>
                    <div className={styles.container}>
                        <section className={styles.wrapper}>
                            <div className={styles.loginWrapper}>
                                <div className={styles.loginHeader}>
                                    <span className={styles.logoText}>IT</span>
                                    <span className={styles.platformName}>JOBHUNTER</span>
                                </div>
                                <h2 className={styles.welcomeTitle}>Chào mừng bạn đến với JobHunter</h2>
                                <Form name="basic" onFinish={onFinish} autoComplete="off" className={styles.loginForm}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Email"
                                        name="username"
                                        rules={[{ required: true, message: 'Email không được để trống!' }]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                    >
                                        <Input.Password size="large" />
                                    </Form.Item>
                                    <div className={styles.loginOptions}>
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <Checkbox>Nhớ mật khẩu</Checkbox>
                                        </Form.Item>
                                        <Link to="/forgot-password" className={styles.forgot}>Quên mật khẩu?</Link>
                                    </div>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={isSubmit} block className={styles.loginBtn}>
                                            Đăng nhập
                                        </Button>
                                    </Form.Item>
                                </Form>
                                
                                {/* OAuth2 Login Buttons */}
                                <div className={styles.oauthSection}>
                                    <Divider>Hoặc đăng nhập bằng</Divider>
                                    <div className={styles.socialRow}>
                                        <button
                                            onClick={handleGoogleLogin}
                                            className={`${styles.socialBtn} ${styles.google}`}
                                            disabled={isOAuth2Loading}
                                            aria-label="Đăng nhập bằng Google"
                                        >
                                            <span className={styles.iconCircle}>
                                                {/* Google Brand Icon (official multi-color G) */}
                                                <svg className={styles.brandIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22" aria-hidden>
                                                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.648 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.676 6.053 29.632 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"/>
                                                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.676 6.053 29.632 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                                                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.173 35.091 26.713 36 24 36c-5.197 0-9.602-3.317-11.243-7.946l-6.534 5.032C9.52 39.47 16.227 44 24 44z"/>
                                                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.79 2.235-2.237 4.153-3.994 5.565.001-.001 6.19 5.238 6.19 5.238C39.079 35.632 44 30.223 44 24c0-1.341-.138-2.651-.389-3.917z"/>
                                                </svg>
                                            </span>
                                            <span>Google</span>
                                        </button>
                                        <button
                                            onClick={handleFacebookLogin}
                                            className={`${styles.socialBtn} ${styles.facebook}`}
                                            disabled={isOAuth2Loading}
                                            aria-label="Đăng nhập bằng Facebook"
                                        >
                                            <span className={styles.iconCircle}>
                                                {/* Facebook Brand Icon */}
                                                <svg className={styles.brandIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22" aria-hidden>
                                                    <path fill="#1877F2" d="M24 4C12.954 4 4 12.954 4 24c0 9.928 7.256 18.141 16.672 19.72V30.156h-5.02V24h5.02v-4.688c0-4.962 3.042-7.67 7.49-7.67 2.131 0 4.357.381 4.357.381v4.79h-2.456c-2.419 0-3.173 1.502-3.173 3.042V24h5.398l-.862 6.156h-4.536V43.72C36.744 42.141 44 33.928 44 24c0-11.046-8.954-20-20-20z"/>
                                                    <path fill="#fff" d="M33.138 30.156L34 24h-5.398v-3.945c0-1.54.754-3.042 3.173-3.042H34v-4.79s-2.226-.381-4.357-.381c-4.448 0-7.49 2.708-7.49 7.67V24h-5.02v6.156h5.02V43.72c1.656.269 3.358.28 5.02 0V30.156h4.536z"/>
                                                </svg>
                                            </span>
                                            <span>Facebook</span>
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.policy}>
                                    Bằng việc đăng nhập, bạn đồng ý với <a href="#">Điều khoản</a> & <a href="#">Chính sách bảo mật</a> của JobHunter.
                                </div>
                                <div className={styles.contact}>
                                    <Divider />
                                    <div>Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></div>
                                    <div>
                                        <span>Liên hệ: </span>
                                        <a href="mailto:support@jobhunter.vn">support@jobhunter.vn</a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default LoginPage;