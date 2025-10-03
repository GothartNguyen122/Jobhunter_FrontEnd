# 🚀 Hướng dẫn Setup ChatBox AI cho JobHunter

## 📋 Tổng quan

Tôi đã tạo thành công một giao diện chatbox AI đẹp và hiện đại cho JobHunter Frontend. Chatbox này có thể tư vấn về nghề nghiệp, tìm việc làm, và trả lời các câu hỏi liên quan.

## 🎯 Tính năng đã tạo

### ✅ Components đã tạo:
- **ChatBox.tsx** - Giao diện chatbox chính với UI đẹp
- **ChatButton.tsx** - Nút floating để mở chatbox
- **ChatWidget.tsx** - Component tổng hợp
- **chatService.ts** - Service kết nối với AI Server
- **SCSS Modules** - Styling đẹp và responsive

### ✅ Tính năng:
- 🎨 Giao diện đẹp, hiện đại với gradient
- 💬 Chat real-time với typing indicator
- 📱 Responsive design cho mobile
- 🔄 Animation mượt mà
- 🎯 AI tư vấn nghề nghiệp
- ⚡ Tích hợp sẵn với AI Server

## 🚀 Cách chạy và xem giao diện

### Bước 1: Chạy Frontend
```bash
cd /Users/gothartnguyen/Documents/Gothart/DAI_HOC_2021_2026/TOT_NGHIEP/Jobhunter_FrontEnd
npm run dev
```

### Bước 2: Mở trình duyệt
- Truy cập: `http://localhost:5173` (hoặc port mà Vite hiển thị)
- Bạn sẽ thấy nút chatbox màu xanh ở góc dưới bên phải
- Click vào nút đó để mở chatbox

### Bước 3: Test chatbox
- Gõ tin nhắn như: "Tôi muốn tìm việc làm"
- Hoặc: "Tư vấn viết CV"
- Hoặc: "Kỹ năng cần thiết"

## 🔧 Cấu hình AI Server (Tùy chọn)

### Nếu muốn kết nối với AI Server thật:

1. **Cài đặt AI Server:**
```bash
cd /Users/gothartnguyen/Documents/Gothart/DAI_HOC_2021_2026/TOT_NGHIEP/Jobhunter_AiServer/Jobhunter_AiServer
npm install
```

2. **Tạo file .env:**
```bash
echo "OPEN_API_KEY=your_openai_api_key_here" > .env
echo "PORT=3001" >> .env
```

3. **Chạy AI Server:**
```bash
npm start
```

4. **Cập nhật URL trong chatService.ts:**
```typescript
const AI_SERVER_URL = 'http://localhost:3001';
```

## 📁 Cấu trúc thư mục đã tạo

```
Jobhunter_FrontEnd/src/components/chatbox_ai/
├── ChatBox.tsx              # Component chatbox chính
├── ChatBox.module.scss      # Styles cho chatbox
├── ChatButton.tsx          # Nút mở chatbox
├── ChatButton.module.scss   # Styles cho nút chat
├── ChatWidget.tsx          # Component tổng hợp
├── chatService.ts          # Service kết nối AI Server
├── index.ts                # Export components
└── README.md               # Hướng dẫn chi tiết
```

## 🎨 Giao diện

### Chatbox có:
- **Header** với avatar bot và tên "JobHunter AI Assistant"
- **Messages area** với tin nhắn của user và bot
- **Input area** với nút gửi
- **Typing indicator** khi bot đang trả lời
- **Responsive design** cho mobile

### ChatButton có:
- **Floating button** ở góc dưới bên phải
- **Pulse animation** để thu hút chú ý
- **Hover effects** mượt mà

## 🔍 Cách test

1. **Mở trang web** → Thấy nút chatbox
2. **Click nút** → Chatbox mở ra
3. **Gõ tin nhắn** → Bot trả lời thông minh
4. **Test responsive** → Thu nhỏ trình duyệt
5. **Test mobile** → Mở DevTools → Mobile view

## 🎯 Các câu hỏi test

Thử hỏi bot những câu này:
- "Tôi muốn tìm việc làm"
- "Tư vấn viết CV"
- "Kỹ năng cần thiết cho lập trình viên"
- "Chuẩn bị phỏng vấn như thế nào?"
- "Mức lương lập trình viên"
- "Công ty công nghệ nào tốt?"

## 🐛 Troubleshooting

### Nếu không thấy chatbox:
1. Kiểm tra console có lỗi không
2. Kiểm tra import trong App.tsx
3. Restart dev server

### Nếu chatbox không hoạt động:
1. Kiểm tra network tab
2. Kiểm tra AI Server có chạy không
3. Kiểm tra CORS settings

## 📱 Mobile Support

Chatbox được tối ưu cho mobile:
- Touch-friendly buttons
- Responsive layout
- Mobile-first design
- Smooth animations

## 🎉 Kết quả

Bạn sẽ có một chatbox AI đẹp, hiện đại với:
- ✅ Giao diện đẹp, professional
- ✅ Animation mượt mà
- ✅ Responsive design
- ✅ AI tư vấn thông minh
- ✅ Tích hợp dễ dàng
- ✅ Code sạch, dễ maintain

**Chúc bạn thành công! 🚀**
