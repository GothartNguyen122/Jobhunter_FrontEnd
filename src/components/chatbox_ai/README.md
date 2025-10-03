# ChatBox AI Component

Giao diện chatbox AI đẹp và hiện đại cho JobHunter Frontend.

## Tính năng

- 🎨 Giao diện đẹp, responsive
- 💬 Chat real-time với AI Assistant
- 🔄 Typing indicator
- 📱 Mobile-friendly
- 🎯 Tư vấn nghề nghiệp và tìm việc làm
- ⚡ Tích hợp với AI Server

## Cấu trúc thư mục

```
chatbox_ai/
├── ChatBox.tsx              # Component chatbox chính
├── ChatBox.module.scss      # Styles cho chatbox
├── ChatButton.tsx          # Nút mở chatbox
├── ChatButton.module.scss   # Styles cho nút chat
├── ChatWidget.tsx          # Component tổng hợp
├── chatService.ts          # Service kết nối AI Server
├── index.ts                # Export components
└── README.md               # Hướng dẫn sử dụng
```

## Cách sử dụng

### 1. Import và sử dụng trong App.tsx

```tsx
import ChatWidget from './components/chatbox_ai/ChatWidget';

function App() {
  return (
    <>
      {/* Các component khác */}
      <ChatWidget />
    </>
  );
}
```

### 2. Sử dụng riêng lẻ

```tsx
import { ChatBox, ChatButton } from './components/chatbox_ai';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <ChatButton onClick={() => setIsOpen(true)} isOpen={isOpen} />
      <ChatBox isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

## Cấu hình AI Server

### 1. Cài đặt AI Server

```bash
cd /path/to/Jobhunter_AiServer/Jobhunter_AiServer
npm install
```

### 2. Cấu hình environment

Tạo file `.env` trong thư mục AI Server:

```env
OPEN_API_KEY=your_openai_api_key_here
PORT=3001
```

### 3. Chạy AI Server

```bash
npm start
```

### 4. Cấu hình Frontend

Trong file `chatService.ts`, cập nhật URL của AI Server:

```typescript
const AI_SERVER_URL = 'http://localhost:3001'; // URL của AI Server
```

## Tính năng AI

Chatbox có thể trả lời các câu hỏi về:

- 🔍 Tìm việc làm theo ngành nghề
- 📝 Tư vấn viết CV
- 🎯 Kỹ năng cần thiết
- 💼 Chuẩn bị phỏng vấn
- 💰 Thông tin về mức lương
- 🏢 Thông tin công ty

## Customization

### Thay đổi màu sắc

Chỉnh sửa trong file SCSS:

```scss
// ChatBox.module.scss
.chatboxHeader {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

// ChatButton.module.scss
.chatButton {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Thay đổi nội dung

Chỉnh sửa trong `ChatBox.tsx`:

```tsx
const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    text: 'Tin nhắn chào mừng của bạn...',
    sender: 'bot',
    timestamp: new Date()
  }
]);
```

## API Endpoints

AI Server cần có các endpoints:

- `POST /api/chat` - Gửi tin nhắn
- `GET /api/chat/history` - Lấy lịch sử chat
- `DELETE /api/chat/history` - Xóa lịch sử chat

## Troubleshooting

### Lỗi kết nối AI Server

1. Kiểm tra AI Server đang chạy
2. Kiểm tra URL trong `chatService.ts`
3. Kiểm tra CORS settings

### Lỗi styling

1. Kiểm tra import SCSS modules
2. Kiểm tra class names
3. Kiểm tra responsive breakpoints

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License
