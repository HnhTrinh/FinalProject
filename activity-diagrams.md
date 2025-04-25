# Activity Diagrams cho Hệ thống E-commerce

Tài liệu này chứa các Activity Diagram mô tả các luồng chính trong hệ thống e-commerce, được tạo bằng PlantUML.

## 1. Luồng Xác thực (Authentication Flow)

```plantuml
@startuml Authentication Flow
title Luồng Xác thực (Authentication Flow)

start

if (Người dùng đã đăng nhập?) then (Có)
  if (Là Admin?) then (Có)
    :Chuyển hướng đến trang Admin Dashboard;
  else (Không)
    :Chuyển hướng đến trang chủ;
  endif
else (Không)
  if (Đăng ký mới?) then (Có)
    :Hiển thị form đăng ký;
    :Nhập thông tin đăng ký
    (tên, email, mật khẩu,
    số điện thoại, địa chỉ);
    :Gửi yêu cầu đăng ký đến API;

    if (Đăng ký thành công?) then (Có)
      :Hiển thị thông báo thành công;
      :Chuyển hướng đến trang đăng nhập;
    else (Không)
      :Hiển thị thông báo lỗi;
      :Quay lại form đăng ký;
    endif
  else (Đăng nhập)
    :Hiển thị form đăng nhập;
    :Nhập email và mật khẩu;
    :Gửi yêu cầu đăng nhập đến API;

    if (Đăng nhập thành công?) then (Có)
      :Lưu token và thông tin người dùng vào localStorage;
      :Khởi tạo sự kiện auth-change;

      if (Là Admin?) then (Có)
        :Chuyển hướng đến trang Admin Dashboard;
      else (Không)
        :Chuyển hướng đến trang chủ;
      endif
    else (Không)
      :Hiển thị thông báo lỗi;
      :Quay lại form đăng nhập;
    endif
  endif
endif

stop
@enduml
```

## 2. Luồng Người dùng Tổng thể (User Overall Flow)

```plantuml
@startuml User Overall Flow
title User Overall Flow

start

:Đăng nhập với tài khoản người dùng;

split
  ' Xem và mua sản phẩm
  :Xem danh sách sản phẩm;
  :Lọc sản phẩm theo danh mục;
  :Chọn sản phẩm để xem chi tiết;
  :Xem thông tin chi tiết sản phẩm;

  if (Còn hàng?) then (Có)
    :Thêm vào giỏ hàng;
    :Gửi yêu cầu thêm vào giỏ hàng đến API;
    :Hiển thị thông báo thành công;
    :Cập nhật số lượng sản phẩm trong giỏ hàng;
  else (Không)
    :Hiển thị thông báo hết hàng;
  endif
split again
  ' Quản lý giỏ hàng và thanh toán
  :Xem giỏ hàng;

  if (Giỏ hàng có sản phẩm?) then (Có)
    :Chọn/bỏ chọn sản phẩm để thanh toán;
    :Cập nhật số lượng sản phẩm;

    if (Thông tin người dùng đầy đủ?) then (Có)
      :Nhấn nút thanh toán;
      :Hiển thị modal thanh toán PayPal;

      ' Quy trình thanh toán PayPal
      :Tạo đơn hàng PayPal;
      :Hiển thị giao diện thanh toán PayPal;
      :Nhập thông tin thẻ hoặc đăng nhập PayPal;
      :Xác nhận thanh toán;

      if (Thanh toán thành công?) then (Có)
        :PayPal trả về thông tin giao dịch;
        :Gửi yêu cầu tạo đơn hàng đến API;
        :Xóa sản phẩm đã thanh toán khỏi giỏ hàng;
        :Hiển thị thông báo thanh toán thành công;
        :Chuyển hướng đến trang danh sách đơn hàng;
      else (Không)
        :Hiển thị thông báo lỗi thanh toán;
        :Quay lại giỏ hàng;
      endif
    else (Không)
      :Hiển thị form cập nhật thông tin người dùng;
      :Cập nhật thông tin người dùng;
    endif
  else (Không)
    :Hiển thị thông báo giỏ hàng trống;
  endif
split again
  ' Quản lý đơn hàng
  :Truy cập trang đơn hàng của tôi;
  :Hiển thị danh sách đơn hàng;
  :Chọn đơn hàng để xem chi tiết;

  :Hiển thị thông tin chi tiết đơn hàng:
  - Danh sách sản phẩm
  - Tổng tiền
  - Trạng thái hiện tại
  - Ngày thanh toán;

  :Xem trạng thái đơn hàng hiện tại;
  :Quay lại danh sách đơn hàng;
split again
  ' Quản lý tài khoản
  :Truy cập trang thông tin cá nhân;
  :Xem thông tin cá nhân hiện tại;

  if (Cập nhật thông tin?) then (Có)
    :Hiển thị form cập nhật thông tin;
    :Cập nhật thông tin cá nhân;
    :Gửi yêu cầu cập nhật đến API;

    if (Cập nhật thành công?) then (Có)
      :Hiển thị thông báo thành công;
      :Cập nhật thông tin hiển thị;
    else (Không)
      :Hiển thị thông báo lỗi;
    endif
  endif

  if (Đổi mật khẩu?) then (Có)
    :Hiển thị form đổi mật khẩu;
    :Nhập mật khẩu cũ và mật khẩu mới;
    :Gửi yêu cầu đổi mật khẩu đến API;

    if (Đổi mật khẩu thành công?) then (Có)
      :Hiển thị thông báo thành công;
    else (Không)
      :Hiển thị thông báo lỗi;
    endif
  endif
end split

:Đăng xuất hoặc tiếp tục mua sắm;

stop
@enduml
```

## 3. Luồng Quản lý Admin Tổng thể (Admin Overall Flow)

```plantuml
@startuml Admin Overall Flow
title Admin Overall Flow

start

:Đăng nhập với tài khoản Admin;

:Truy cập Admin Dashboard;

split
  ' Thống kê tổng quan
  :Xem thống kê tổng quan;
  :Hiển thị số liệu thống kê:
  - Tổng số đơn hàng
  - Doanh thu
  - Số lượng sản phẩm
  - Số lượng người dùng;

split again
  ' Quản lý Sản phẩm
  :Truy cập trang quản lý sản phẩm;
  :Hiển thị danh sách sản phẩm;

  split
    :Thêm sản phẩm mới;
    :Hiển thị form thêm sản phẩm;
    :Nhập thông tin sản phẩm
    (tên, giá, mô tả, tính năng,
    số lượng, danh mục);
    :Tải lên hình ảnh sản phẩm lên Cloudinary;
    :Gửi yêu cầu tạo sản phẩm đến API;

    if (Tạo sản phẩm thành công?) then (Có)
      :Hiển thị thông báo thành công;
      :Cập nhật danh sách sản phẩm;
    else (Không)
      :Hiển thị thông báo lỗi;
    endif
  split again
    :Chỉnh sửa sản phẩm;
    :Chọn sản phẩm cần chỉnh sửa;
    :Hiển thị form chỉnh sửa với thông tin hiện tại;
    :Cập nhật thông tin sản phẩm;
    :Gửi yêu cầu cập nhật sản phẩm đến API;

    if (Cập nhật sản phẩm thành công?) then (Có)
      :Hiển thị thông báo thành công;
      :Cập nhật danh sách sản phẩm;
    else (Không)
      :Hiển thị thông báo lỗi;
    endif
  split again
    :Xóa sản phẩm;
    :Chọn sản phẩm cần xóa;
    :Hiển thị xác nhận xóa;

    if (Xác nhận xóa?) then (Có)
      :Gửi yêu cầu xóa sản phẩm đến API;

      if (Xóa sản phẩm thành công?) then (Có)
        :Hiển thị thông báo thành công;
        :Cập nhật danh sách sản phẩm;
      else (Không)
        :Hiển thị thông báo lỗi;
      endif
    else (Không)
      :Hủy xóa sản phẩm;
    endif
  end split
split again
  ' Quản lý Danh mục
  :Truy cập trang quản lý danh mục;
  :Hiển thị danh sách danh mục;

  split
    :Thêm danh mục mới;
    :Hiển thị form thêm danh mục;
    :Nhập tên danh mục;
    :Gửi yêu cầu tạo danh mục đến API;

    if (Tạo danh mục thành công?) then (Có)
      :Hiển thị thông báo thành công;
      :Cập nhật danh sách danh mục;
    else (Không)
      :Hiển thị thông báo lỗi;
    endif
  split again
    :Chỉnh sửa danh mục;
    :Chọn danh mục cần chỉnh sửa;
    :Hiển thị form chỉnh sửa với tên hiện tại;
    :Cập nhật tên danh mục;
    :Gửi yêu cầu cập nhật danh mục đến API;

    if (Cập nhật danh mục thành công?) then (Có)
      :Hiển thị thông báo thành công;
      :Cập nhật danh sách danh mục;
    else (Không)
      :Hiển thị thông báo lỗi;
    endif
  split again
    :Xóa danh mục;
    :Chọn danh mục cần xóa;
    :Hiển thị xác nhận xóa;

    if (Xác nhận xóa?) then (Có)
      :Gửi yêu cầu xóa danh mục đến API;

      if (Xóa danh mục thành công?) then (Có)
        :Hiển thị thông báo thành công;
        :Cập nhật danh sách danh mục;
      else (Không)
        :Hiển thị thông báo lỗi;
      endif
    else (Không)
      :Hủy xóa danh mục;
    endif
  end split
split again
  ' Quản lý Đơn hàng
  :Truy cập trang quản lý đơn hàng;
  :Hiển thị tất cả đơn hàng trong hệ thống;

  split
    ' Xem chi tiết đơn hàng
    :Chọn đơn hàng để xem chi tiết;
    :Hiển thị thông tin chi tiết đơn hàng:
    - Thông tin khách hàng
    - Danh sách sản phẩm
    - Tổng tiền
    - Trạng thái hiện tại
    - Ngày thanh toán;
  split again
    ' Cập nhật trạng thái đơn hàng
    :Chọn đơn hàng cần cập nhật;
    :Hiển thị tùy chọn cập nhật trạng thái;
    :Chọn trạng thái mới
    (pending, processing, shipped,
    delivered, completed);
    :Gửi yêu cầu cập nhật trạng thái đến API;

    if (Cập nhật thành công?) then (Có)
      :Hiển thị thông báo thành công;
      :Cập nhật thông tin đơn hàng;
    else (Không)
      :Hiển thị thông báo lỗi;
    endif
  split again
    ' Thống kê đơn hàng
    :Xem thống kê đơn hàng theo trạng thái;
    :Hiển thị biểu đồ phân bố đơn hàng;
    :Xem doanh thu theo thời gian;
    :Hiển thị biểu đồ doanh thu;
  end split
end split

:Đăng xuất hoặc tiếp tục quản lý;

stop
@enduml
```

## 4. Luồng Xử lý Token (Token Handling Flow)

```plantuml
@startuml Token Handling Flow
title Luồng Xử lý Token (Token Handling Flow)

start

:Khởi tạo ứng dụng;

:AuthInitializer kiểm tra token trong localStorage;

if (Token và thông tin người dùng hợp lệ?) then (Có)
  :Giữ nguyên thông tin xác thực;
else (Không)
  :Xóa tất cả dữ liệu trong localStorage;
endif

:Gửi yêu cầu API với token trong header;

if (Token hợp lệ?) then (Có)
  :API trả về dữ liệu;
else (Không)
  if (Token hết hạn hoặc không hợp lệ?) then (Có)
    :Xóa tất cả dữ liệu trong localStorage;
    :Hiển thị thông báo phiên đăng nhập hết hạn;
    :Chuyển hướng đến trang đăng nhập;
  else (Lỗi khác)
    :Hiển thị thông báo lỗi;
  endif
endif

stop
@enduml
```

## 5. Luồng Tải lên Hình ảnh (Image Upload Flow)

```plantuml
@startuml Image Upload Flow
title Luồng Tải lên Hình ảnh (Image Upload Flow)

start

:Chọn file hình ảnh từ thiết bị;

if (File hợp lệ?) then (Có)
  :Hiển thị trạng thái đang tải lên;
  :Tạo FormData với file và upload_preset;
  :Gửi yêu cầu tải lên đến Cloudinary API;

  if (Tải lên thành công?) then (Có)
    :Nhận URL hình ảnh từ response;
    :Lưu URL hình ảnh vào state;
    :Hiển thị hình ảnh đã tải lên;
  else (Không)
    :Hiển thị thông báo lỗi tải lên;
  endif
else (Không)
  :Hiển thị thông báo file không hợp lệ;
endif

stop
@enduml
```

## Cách sử dụng các Activity Diagram

Các Activity Diagram trên mô tả các luồng chính trong hệ thống e-commerce. Để sử dụng các diagram này:

1. Sao chép mã PlantUML vào công cụ hỗ trợ PlantUML như [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/) hoặc plugin PlantUML trong các IDE như Visual Studio Code, IntelliJ IDEA.

2. Render diagram để xem biểu đồ trực quan.

3. Sử dụng các diagram này để:
   - Hiểu rõ luồng hoạt động của hệ thống
   - Tài liệu hóa quy trình nghiệp vụ
   - Trình bày với các bên liên quan
   - Hỗ trợ phát triển và bảo trì hệ thống

Các Activity Diagram này có thể được mở rộng hoặc điều chỉnh để phản ánh chính xác hơn các yêu cầu cụ thể của dự án.
