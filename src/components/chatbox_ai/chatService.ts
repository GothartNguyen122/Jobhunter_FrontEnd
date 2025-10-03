import axios from 'axios';

const AI_SERVER_URL = 'http://localhost:3001'; // URL của AI Server

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

class ChatService {
  private baseURL: string;

  constructor(baseURL: string = AI_SERVER_URL) {
    this.baseURL = baseURL;
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/chat`, {
        message: message,
        timestamp: new Date().toISOString()
      });

      return {
        message: response.data.message || response.data.response,
        timestamp: response.data.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending message to AI server:', error);
      
      // Fallback response if AI server is not available
      return {
        message: this.getFallbackResponse(message),
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
      const response = await axios.get(`${this.baseURL}/api/chat/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  async clearChatHistory(): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/api/chat/history`);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }
}

export default new ChatService();
