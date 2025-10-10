import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface OAuth2CompleteResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

class OAuth2Service {
  // Đổi authorization code (Google) lấy JWT hệ thống - Login
  async loginWithGoogleCode(code: string, redirectUri: string): Promise<OAuth2CompleteResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google/login`, null, {
        params: { code, redirectUri },
        withCredentials: true
      });
      const body = response.data && typeof response.data === 'object'
        ? (response.data.data ?? response.data)
        : response.data;
      return body;
    } catch (error) {
      console.error('Google code exchange error:', error);
      throw error;
    }
  }

  // Đổi authorization code (Google) lấy JWT hệ thống - Register
  async registerWithGoogleCode(code: string, redirectUri: string): Promise<OAuth2CompleteResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google/register`, null, {
        params: { code, redirectUri },
        withCredentials: true
      });
      const body = response.data && typeof response.data === 'object'
        ? (response.data.data ?? response.data)
        : response.data;
      return body;
    } catch (error) {
      console.error('Google register code exchange error:', error);
      throw error;
    }
  }
}

export default new OAuth2Service();
