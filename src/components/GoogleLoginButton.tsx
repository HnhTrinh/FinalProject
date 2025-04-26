import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (data) => {
      try {
        // Lấy thông tin người dùng từ Google
        // const userInfo = await authAPI.getGoogleUserInfo(data.access_token);

        // console.log('Google user info:', userInfo.data);

        // Gửi access token đến server để xác thực
        const response = await authAPI.googleLogin(data.access_token);

        if (response.data?.success) {
          const userData = response.data.data.user;
          const token = response.data.data.token;

          // Lưu thông tin vào localStorage
          localStorage.setItem('access_token', token);
          localStorage.setItem('authorization', 'true');
          localStorage.setItem('user_id', userData._id);
          localStorage.setItem('user_email', userData.email);
          localStorage.setItem('user_name', userData.name);
          localStorage.setItem('user_isAdmin', userData.isAdmin.toString());
          localStorage.setItem('user_phone', userData.phone || '');
          localStorage.setItem('user_address', userData.address || '');

          // Hiển thị thông báo thành công
          toast.success('Đăng nhập với Google thành công!');

          // Khởi tạo sự kiện auth-change để cập nhật trạng thái xác thực
          window.dispatchEvent(new Event('auth-change'));

          // Chuyển hướng dựa vào quyền admin
          navigate(userData.isAdmin ? "/admin/product" : '/');
        } else {
          toast.error(response.data?.message || 'Đăng nhập với Google thất bại');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Đăng nhập với Google thất bại');
      }
    },
    onError: (error) => {
      toast.error('Đăng nhập với Google thất bại');
    },
  });

  return (
    <Button
      onClick={() => login()}
      icon={<GoogleOutlined />}
      className="w-full rounded-lg h-10 flex items-center justify-center"
      size="large"
    >
      Đăng nhập với Google
    </Button>
  );
};

export default GoogleLoginButton;
