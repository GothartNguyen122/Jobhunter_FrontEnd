import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface GoogleLoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

class GoogleAuthService {
  /**
   * Đổi authorization code (Google) lấy JWT hệ thống
   */
  async loginWithGoogleCode(code: string, redirectUri: string): Promise<GoogleLoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google/login`, null, {
        params: { code, redirectUri },
        withCredentials: true
      });
      
      // Backend trả về ResLoginDTO trực tiếp
      return response.data;
    } catch (error) {
      console.error('Google code exchange error:', error);
      throw error;
    }
  }
}

export default new GoogleAuthService();
