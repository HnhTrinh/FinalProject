# Hướng dẫn cấu hình Google OAuth cho dự án

Tài liệu này hướng dẫn cách cấu hình Google OAuth để sử dụng tính năng đăng nhập bằng Google trong dự án.

## 1. Tạo dự án trên Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một dự án mới hoặc chọn dự án hiện có
3. Đi đến "APIs & Services" > "Credentials"

## 2. Cấu hình OAuth Consent Screen

1. Chọn "OAuth consent screen" từ menu bên trái
2. Chọn loại người dùng (External hoặc Internal)
3. Điền thông tin cần thiết:
   - App name: Tên ứng dụng của bạn
   - User support email: Email hỗ trợ
   - Developer contact information: Email liên hệ
4. Thêm các scopes cần thiết:
   - `email`
   - `profile`
   - `openid`
5. Thêm test users nếu cần thiết
6. Lưu và tiếp tục

## 3. Tạo OAuth Client ID

1. Chọn "Credentials" từ menu bên trái
2. Nhấp vào "Create Credentials" > "OAuth client ID"
3. Chọn loại ứng dụng: "Web application"
4. Đặt tên cho client ID
5. Thêm Authorized JavaScript origins:
   - `http://localhost:5173` (cho môi trường phát triển)
   - `https://your-production-domain.com` (cho môi trường production)
6. Thêm Authorized redirect URIs:
   - `http://localhost:5173` (cho môi trường phát triển)
   - `https://your-production-domain.com` (cho môi trường production)
7. Nhấp vào "Create"

## 4. Lấy Client ID

Sau khi tạo OAuth client ID, bạn sẽ nhận được:
- Client ID
- Client Secret

## 5. Cấu hình trong dự án

1. Mở file `.env` trong dự án
2. Thêm hoặc cập nhật biến môi trường:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
   ```
3. Thay thế `YOUR_GOOGLE_CLIENT_ID` bằng Client ID bạn đã nhận được từ Google Cloud Console

## 6. Bật Google People API

1. Đi đến "APIs & Services" > "Library"
2. Tìm kiếm "Google People API"
3. Chọn API và nhấp vào "Enable"

## 7. Kiểm tra cấu hình

1. Khởi động lại ứng dụng
2. Truy cập trang đăng nhập
3. Nhấp vào nút "Đăng nhập với Google"
4. Xác nhận rằng quá trình đăng nhập hoạt động đúng

## Lưu ý quan trọng

- Đảm bảo rằng Client ID được cấu hình đúng ở cả phía client và server
- Trong môi trường phát triển, bạn có thể cần thêm email của mình vào danh sách test users
- Đối với môi trường production, đảm bảo rằng bạn đã thêm domain chính thức vào Authorized JavaScript origins và Authorized redirect URIs
- Nếu bạn thay đổi domain hoặc URL, hãy cập nhật lại cấu hình trong Google Cloud Console
