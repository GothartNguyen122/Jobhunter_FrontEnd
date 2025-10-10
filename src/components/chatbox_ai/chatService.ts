import { callSendMessage, callGetChatHistory, callClearChatHistory, callLegacyChat, callLegacyChatHistory, callLegacyClearHistory } from '@/config/api';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

export interface UserInfo {
  id?: string;
  name?: string;
  email?: string;
  role?: {
    id?: string;
    name?: string;
    permissions?: any[];
  };
}

class ChatService {
  private chatboxId: string;
  private useLegacyAPI: boolean;

  constructor(chatboxId: string = 'default', useLegacyAPI: boolean = false) {
    this.chatboxId = chatboxId;
    this.useLegacyAPI = useLegacyAPI;
  }

  async sendMessage(userMessage: string, userInfo?: UserInfo): Promise<ChatResponse> {
    try {
      // Tạo dữ liệu user mẫu nếu không có thông tin user
      const user = userInfo ? {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role?.name,
        permissions: userInfo.role?.permissions
      } : {
        id: 'guest_001',
        name: 'Khách hàng',
        email: 'guest@jobhunter.com',
        role: 'user',
        permissions: []
      };

      // Thêm một số dữ liệu mẫu khác nhau để test
      const sampleUsers = [
        {
          id: 'guest_001',
          name: 'Khách hàng',
          email: 'guest@jobhunter.com',
          role: 'user',
          permissions: []
        },
        {
          id: 'demo_002',
          name: 'Nguyễn Văn Demo',
          email: 'demo@jobhunter.com',
          role: 'candidate',
          permissions: ['view_jobs', 'apply_jobs']
        },
        {
          id: 'hr_003',
          name: 'HR Manager',
          email: 'hr@jobhunter.com',
          role: 'hr',
          permissions: ['view_candidates', 'manage_jobs', 'view_analytics']
        }
      ];

      // Sử dụng dữ liệu mẫu ngẫu nhiên nếu không có userInfo
      const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const finalUser = userInfo ? user : randomUser;

      // Log thông tin user được gửi đi
      console.log('[ChatService] User data being sent:', finalUser);

      // Log cấu trúc request gửi đi
      // eslint-disable-next-line no-console
      console.log('[ChatService] AI Request →', { message: userMessage, user: finalUser, chatboxId: this.chatboxId });

      let response;
      
      if (this.useLegacyAPI) {
        // Use legacy API for backward compatibility
        response = await callLegacyChat(userMessage, finalUser);
      } else {
        // Use new multi-chatbox API
        response = await callSendMessage(this.chatboxId, userMessage, finalUser);
      }

      // Log cấu trúc response trả về từ AI Server (raw)
      // eslint-disable-next-line no-console
      console.log('[ChatService] AI Response ←', response?.data);

      // Kiểm tra cấu trúc response và xử lý an toàn
      const responseData = response?.data;
      let message = '';
      let timestamp = new Date().toISOString();

      if (responseData) {
        // Thử các cấu trúc response khác nhau
        if (responseData.data?.message) {
          message = responseData.data.message;
          timestamp = responseData.data.timestamp || timestamp;
        } else if (responseData.message) {
          message = responseData.message;
          timestamp = responseData.timestamp || timestamp;
        } else if (typeof responseData === 'string') {
          message = responseData;
        } else {
          message = 'Không thể xử lý phản hồi từ AI Server';
          console.warn('[ChatService] Unexpected response structure:', responseData);
        }
      } else {
        message = 'Không nhận được phản hồi từ AI Server';
      }

      return {
        message,
        timestamp
      };
    } catch (error) {
      // Log lỗi và response (nếu có) để dễ debug
      // eslint-disable-next-line no-console
      console.error('[ChatService] AI Error ✖', error);
      // eslint-disable-next-line no-console
      if ((error as any)?.response) console.error('[ChatService] AI Error Response ✖', (error as any).response?.data);
      
      // Kiểm tra loại lỗi để xử lý phù hợp
      const axiosError = error as any;
      
      if (axiosError?.isAxiosError) {
        if (!axiosError?.response) {
          // Không có response - server không chạy hoặc network error
          console.warn('[ChatService] AI Server unreachable, using fallback response');
          return {
            message: this.getFallbackResponse(userMessage),
            timestamp: new Date().toISOString()
          };
        } else {
          // Có response nhưng status code lỗi
          const status = axiosError.response?.status;
          const errorData = axiosError.response?.data;
          console.error(`[ChatService] AI Server error ${status}:`, errorData);
          
          if (status === 404) {
            return {
              message: 'AI Server endpoint không tồn tại. Vui lòng kiểm tra cấu hình.',
              timestamp: new Date().toISOString()
            };
          } else if (status >= 500) {
            return {
              message: 'AI Server đang gặp sự cố. Vui lòng thử lại sau.',
              timestamp: new Date().toISOString()
            };
          } else {
            return {
              message: this.getFallbackResponse(userMessage),
              timestamp: new Date().toISOString()
            };
          }
        }
      }
      
      // Lỗi khác - sử dụng fallback
      return {
        message: this.getFallbackResponse(userMessage),
        timestamp: new Date().toISOString()
      };
    }
  }

  private getFallbackResponse(userInput: string): string {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('việc làm') || lowerInput.includes('job') || lowerInput.includes('tuyển dụng')) {
      return 'Tôi có thể giúp bạn tìm việc làm phù hợp! Bạn có thể tìm kiếm theo ngành nghề, địa điểm, hoặc mức lương mong muốn. Bạn quan tâm đến lĩnh vực nào?';
    }
    
    if (lowerInput.includes('cv') || lowerInput.includes('resume') || lowerInput.includes('hồ sơ')) {
      return 'Tôi có thể tư vấn về cách viết CV hiệu quả! Một CV tốt nên có: thông tin cá nhân rõ ràng, kinh nghiệm làm việc chi tiết, kỹ năng phù hợp, và thành tích nổi bật. Bạn muốn tư vấn về phần nào?';
    }
    
    if (lowerInput.includes('kỹ năng') || lowerInput.includes('skill')) {
      return 'Kỹ năng là yếu tố quan trọng trong tìm việc! Các kỹ năng phổ biến hiện nay bao gồm: lập trình, marketing, quản lý dự án, ngoại ngữ... Bạn có kỹ năng nào nổi bật?';
    }
    
    if (lowerInput.includes('phỏng vấn') || lowerInput.includes('interview')) {
      return 'Chuẩn bị phỏng vấn là bước quan trọng! Tôi khuyên bạn: nghiên cứu về công ty, chuẩn bị câu trả lời cho các câu hỏi thường gặp, ăn mặc phù hợp, và tự tin. Bạn có câu hỏi cụ thể nào về phỏng vấn?';
    }
    
    if (lowerInput.includes('lương') || lowerInput.includes('salary') || lowerInput.includes('thu nhập')) {
      return 'Mức lương phụ thuộc vào nhiều yếu tố như kinh nghiệm, kỹ năng, địa điểm và ngành nghề. Bạn có thể tham khảo các trang web tuyển dụng để biết mức lương trung bình cho vị trí bạn quan tâm.';
    }
    
    if (lowerInput.includes('công ty') || lowerInput.includes('company') || lowerInput.includes('doanh nghiệp')) {
      return 'Tôi có thể giúp bạn tìm hiểu về các công ty phù hợp! Bạn quan tâm đến lĩnh vực nào? Có thể là công nghệ, tài chính, marketing, hoặc các ngành khác?';
    }
    
    return 'Cảm ơn bạn đã hỏi! Tôi là AI Assistant chuyên về tư vấn nghề nghiệp và tìm việc làm. Bạn có thể hỏi tôi về: tìm việc làm, viết CV, kỹ năng cần thiết, chuẩn bị phỏng vấn, hoặc thông tin về các công ty. Tôi có thể giúp gì thêm cho bạn?';
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    try {
      let response;
      
      if (this.useLegacyAPI) {
        response = await callLegacyChatHistory();
      } else {
        response = await callGetChatHistory(this.chatboxId);
      }
      
      return response.data || response.data || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  async clearChatHistory(): Promise<void> {
    try {
      if (this.useLegacyAPI) {
        await callLegacyClearHistory();
      } else {
        await callClearChatHistory(this.chatboxId);
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }

  // Method to switch chatbox
  setChatboxId(chatboxId: string): void {
    this.chatboxId = chatboxId;
  }

  // Method to toggle between new and legacy API
  setUseLegacyAPI(useLegacy: boolean): void {
    this.useLegacyAPI = useLegacy;
  }

  // Get current chatbox ID
  getChatboxId(): string {
    return this.chatboxId;
  }
}

// Export default instance with default chatbox
// Thay đổi useLegacyAPI thành true nếu API mới không hoạt động
export default new ChatService('default', true);
