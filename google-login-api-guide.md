# Hướng dẫn sử dụng API Login với Google

API này cho phép người dùng đăng nhập vào hệ thống bằng tài khoản Google. Khi đăng nhập thành công, hệ thống sẽ:
- Nếu email đã tồn tại trong database: Sử dụng thông tin user hiện có để tạo token
- Nếu email chưa tồn tại: Tạo tài khoản mới trong database với thông tin từ Google

## Cấu hình phía Client

### 1. Cài đặt thư viện Google OAuth

```bash
npm install @react-oauth/google
```

### 2. Cấu hình Google OAuth Provider trong ứng dụng React

```jsx
// src/main.jsx hoặc src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
```

### 3. Tạo component đăng nhập với Google

```jsx
// src/components/GoogleLogin.jsx
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Lấy thông tin người dùng từ Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        // Gửi ID token đến server để xác thực
        const response = await axios.post('http://localhost:5002/api/v1/auth/google', {
          tokenId: tokenResponse.access_token,
        });

        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.data.token);
        
        // Lưu thông tin user
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Chuyển hướng hoặc cập nhật trạng thái đăng nhập
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Google login failed:', error);
      }
    },
    onError: (error) => console.error('Login Failed:', error),
  });

  return (
    <button 
      onClick={() => login()} 
      className="google-login-button"
    >
      Đăng nhập với Google
    </button>
  );
};

export default GoogleLoginButton;
```

## Cấu hình phía Server

### 1. Cài đặt thư viện cần thiết

```bash
npm install google-auth-library --save
```

### 2. Cấu hình biến môi trường

Thêm Client ID vào file `.env`:

```
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

### 3. API Endpoint

- **URL**: `/api/v1/auth/google`
- **Method**: POST
- **Body**:
  ```json
  {
    "tokenId": "Google access token"
  }
  ```

### 4. Phản hồi

- **Thành công (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Google login successful",
    "data": {
      "user": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "phone": "phone_number",
        "address": "user_address",
        "isAdmin": false,
        "pictureURL": "profile_picture_url",
        "orders": [],
        "cartItems": []
      },
      "token": "jwt_token"
    }
  }
  ```

- **Lỗi (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Google token ID is required",
    "error": null
  }
  ```

- **Lỗi (500 Internal Server Error)**:
  ```json
  {
    "success": false,
    "message": "Failed to login with Google",
    "error": "Error message"
  }
  ```

## Lưu ý quan trọng

1. Đảm bảo rằng Client ID được cấu hình đúng ở cả phía client và server.
2. Thêm domain của ứng dụng vào danh sách Authorized JavaScript origins trong Google Cloud Console.
3. Đảm bảo rằng API Google People được bật trong Google Cloud Console.

## Quy trình hoạt động

1. Người dùng nhấp vào nút "Đăng nhập với Google"
2. Google hiển thị cửa sổ popup cho phép người dùng chọn tài khoản
3. Sau khi người dùng chọn tài khoản, Google trả về access token
4. Client gửi access token đến server
5. Server xác thực token với Google
6. Server kiểm tra email trong database:
   - Nếu email đã tồn tại: Sử dụng thông tin user hiện có
   - Nếu email chưa tồn tại: Tạo tài khoản mới
7. Server tạo JWT token và trả về cho client
8. Client lưu token và thông tin user, sau đó chuyển hướng người dùng

## Bảo mật

- Luôn xác thực token ở phía server
- Không lưu trữ Google access token, chỉ sử dụng nó để xác thực
- Sử dụng HTTPS cho tất cả các yêu cầu API
- Đặt thời gian hết hạn hợp lý cho JWT token
