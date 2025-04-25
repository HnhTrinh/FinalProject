# Sử dụng Interface trong Dự án

Tài liệu này liệt kê các interface được định nghĩa trong dự án và các file sử dụng chúng.

## Interface IUserData

Interface `IUserData` được định nghĩa trong file `src\types\authen.type.ts` với cấu trúc như sau:

```typescript
export interface IUserData {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  orders?: any[];
  cartItems?: {
    product: {
      id?: string;
      _id?: string;
      name: string;
      pictureURL: string;
      feature?: string[];
      price: number;
      [key: string]: any;
    };
    quantity: number;
    [key: string]: any;
  }[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
```

### Các file sử dụng interface IUserData

1. **src\services\authen.service.ts**
   - Import: `import { IUserData } from "../types/authen.type";`
   - Sử dụng: Trong hàm `registerService` để định nghĩa kiểu dữ liệu cho tham số đầu vào
   ```typescript
   export const registerService = (data: IUserData) => {
     return axios.post(`${import.meta.env.VITE_API_API_URL as string}/auth/register`, data)
   }
   ```

2. **src\page\auth\register.tsx**
   - Import: `import { IUserData } from "../../types/authen.type";`
   - Sử dụng: Trong hàm `handleRegister` để định nghĩa kiểu dữ liệu cho tham số đầu vào từ form đăng ký
   ```typescript
   const handleRegister = async (values: IUserData) => {
     setLoading(true);
     setError(null);
     // ...
   }
   ```

3. **src\services\api.ts**
   - Không import trực tiếp, nhưng sử dụng cấu trúc tương tự trong các API call
   - Ví dụ: Trong `authAPI.register` và `userAPI.updateUser`
   ```typescript
   register: (data: any) => {
     return axiosInstance.post('/auth/register', data);
   }
   ```
   ```typescript
   updateUser: (data: any) => {
     return axiosInstance.put('/user/profile', data);
   }
   ```

4. **src\page\cart\index.tsx**
   - Không import trực tiếp, nhưng sử dụng cấu trúc tương tự khi lấy thông tin người dùng
   ```typescript
   const userResponse = await userAPI.getCurrentUser();
   if (userResponse.data?.success) {
     const userData = userResponse.data.data;
     setUserProfile(userData);
     // ...
   }
   ```

5. **src\components\AdminNavbar.tsx**
   - Sử dụng một interface tương tự nhưng đơn giản hơn
   ```typescript
   interface UserInfo {
     name?: string;
     email?: string;
     isAdmin?: boolean;
   }
   ```

## Các interface khác trong dự án

### AuthRouteProps (src\components\AuthRoute.tsx)

```typescript
interface AuthRouteProps {
  /**
   * Loại route:
   * - 'admin': Chỉ cho phép admin truy cập
   * - 'user': Chỉ cho phép người dùng đã đăng nhập truy cập
   * - 'public': Chỉ cho phép người dùng chưa đăng nhập truy cập
   */
  routeType: 'admin' | 'user' | 'public';
}
```

## Quản lý trạng thái xác thực

Dự án sử dụng localStorage để quản lý trạng thái xác thực thay vì Redux. Các thông tin người dùng được lưu trữ trong localStorage với các key sau:

- `access_token`: JWT token
- `authorization`: 'true' nếu đã xác thực
- `user_id`: ID của người dùng
- `user_email`: Email của người dùng
- `user_name`: Tên của người dùng
- `user_isAdmin`: 'true' nếu người dùng là admin
- `user_phone`: Số điện thoại của người dùng
- `user_address`: Địa chỉ của người dùng

Custom hook `useAuth` trong file `src\hooks\useAuth.tsx` được sử dụng để kiểm tra trạng thái xác thực từ localStorage và cung cấp các giá trị `isAuthenticated`, `isAdmin` và `isLoading` cho các component khác.

## Lưu ý về việc sử dụng interface

1. **Tính nhất quán**: Một số file sử dụng `any` thay vì interface cụ thể, điều này có thể dẫn đến lỗi kiểu dữ liệu trong quá trình phát triển.

2. **Mở rộng**: Interface `IUserData` khá lớn và có nhiều trường tùy chọn. Có thể cân nhắc tách thành các interface nhỏ hơn và sử dụng kế thừa.

3. **Cải thiện**: Nên sử dụng interface thay vì `any` trong các API call để tăng tính an toàn về kiểu dữ liệu.
