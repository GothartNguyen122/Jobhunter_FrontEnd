import { useEffect, useRef } from 'react';
import { message, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import oauth2Service from '@/services/oauth2Service';

// Helper function to determine redirect path based on user role
const getRedirectPath = (user: any) => {
    // Check if user has admin/HR role
    const isAdmin = user?.role?.name === 'ADMIN' || user?.role?.name === 'SUPER_ADMIN';
    const isHR = user?.role?.name === 'HR';
    const hasAdminPermissions = user?.role?.permissions?.length > 0;
    
    if (isAdmin || isHR || hasAdminPermissions) {
        return '/admin';
    }
    
    return '/';
};

const GoogleAuthCallback = () => {
  const dispatch = useDispatch();
  const executedRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (executedRef.current) return; // prevent double-run in StrictMode/HMR
      executedRef.current = true;
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      const redirectUri = `${window.location.origin}/auth/callback`;

      if (error) {
        notification.error({ message: 'Đăng nhập thất bại!', description: error });
        return;
      }

      if (!code) {
        notification.error({ message: 'Đăng nhập thất bại!', description: 'Thiếu mã xác thực (code).' });
        return;
      }

      try {
        // Check if this is a register flow from state parameter
        const state = params.get('state');
        const isRegister = state && state.startsWith('register_');
        
        const res = isRegister 
          ? await oauth2Service.registerWithGoogleCode(code, redirectUri)
          : await oauth2Service.loginWithGoogleCode(code, redirectUri);
          
        if (res && res.user) {
          const token = (res as any).access_token ?? (res as any).accessToken;
          if (token) localStorage.setItem('access_token', token);
          dispatch(setUserLoginInfo(res.user));
          message.success(isRegister ? 'Đăng ký bằng Google thành công!' : 'Đăng nhập bằng Google thành công!');
          
          // Determine redirect path based on user role
          const redirectPath = getRedirectPath(res.user);
          window.location.replace(redirectPath);
          return;
        }
        // No user in response => treat as unregistered
        notification.error({
          message: isRegister ? 'Đăng ký thất bại!' : 'Đăng nhập thất bại!',
          description: isRegister ? 'Không thể tạo tài khoản với Google.' : 'Tài khoản Gmail này chưa được đăng ký.',
          duration: 5,
        });
      } catch (e: any) {
        const status = e?.response?.status;
        const state = params.get('state');
        const isRegister = state && state.startsWith('register_');
        
        if (status === 401) {
          notification.error({
            message: isRegister ? 'Đăng ký thất bại!' : 'Đăng nhập thất bại!',
            description: 'Không thể xác thực với Google.',
            duration: 5,
          });
        }
        // ignore abort/cancel errors due to navigation
      }
    };
    run();
  }, [dispatch]);

  return null;
};

export default GoogleAuthCallback;



