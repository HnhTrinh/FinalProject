# 20 Câu hỏi bảo vệ đồ án

## Câu hỏi về kiến trúc và thiết kế

1. **Tại sao bạn chọn React và TypeScript cho dự án này? Những lợi ích và thách thức bạn gặp phải khi sử dụng TypeScript so với JavaScript thuần?**
   
   *In English: Why did you choose React and TypeScript for this project? What benefits and challenges did you encounter when using TypeScript compared to plain JavaScript?*

2. **Hãy giải thích cấu trúc thư mục của dự án. Tại sao bạn tổ chức code theo cách này và nó mang lại lợi ích gì cho việc bảo trì và mở rộng dự án?**
   
   *In English: Please explain the folder structure of your project. Why did you organize the code this way and what benefits does it bring for project maintenance and scalability?*

3. **Bạn đã áp dụng những design pattern nào trong dự án? Hãy lấy ví dụ cụ thể và giải thích tại sao bạn chọn pattern đó.**
   
   *In English: What design patterns have you applied in the project? Please provide specific examples and explain why you chose those patterns.*

4. **Giải thích cách bạn quản lý state trong ứng dụng. Tại sao bạn không sử dụng Redux mà chọn localStorage để quản lý trạng thái xác thực?**
   
   *In English: Explain how you manage state in your application. Why did you choose localStorage over Redux for authentication state management?*

## Câu hỏi về xác thực và bảo mật

5. **Hãy giải thích chi tiết luồng xác thực trong ứng dụng của bạn. Làm thế nào bạn xử lý các vấn đề như token hết hạn, phân quyền admin/user?**
   
   *In English: Please explain in detail the authentication flow in your application. How do you handle issues like token expiration and admin/user authorization?*

6. **Bạn đã thực hiện những biện pháp bảo mật nào để bảo vệ dữ liệu người dùng và ngăn chặn các cuộc tấn công phổ biến như XSS, CSRF?**
   
   *In English: What security measures have you implemented to protect user data and prevent common attacks like XSS, CSRF?*

7. **Giải thích sự khác biệt giữa các component AuthRoute, ProtectedRoute và PublicRoute trong dự án của bạn. Tại sao cần phân chia như vậy?**
   
   *In English: Explain the differences between AuthRoute, ProtectedRoute, and PublicRoute components in your project. Why is this separation necessary?*

## Câu hỏi về API và xử lý dữ liệu

8. **Hãy giải thích cách bạn tổ chức và quản lý các API call trong dự án. Tại sao bạn chọn cấu trúc này và nó giúp gì cho việc bảo trì code?**
   
   *In English: Please explain how you organize and manage API calls in the project. Why did you choose this structure and how does it help with code maintenance?*

9. **Giải thích cách bạn xử lý lỗi từ API và hiển thị thông báo cho người dùng. Bạn có cơ chế retry hoặc fallback nào không?**
   
   *In English: Explain how you handle API errors and display notifications to users. Do you have any retry or fallback mechanisms?*

10. **Bạn đã sử dụng Axios interceptors như thế nào trong dự án? Những lợi ích mà interceptors mang lại là gì?**
    
    *In English: How have you used Axios interceptors in your project? What benefits do interceptors provide?*

## Câu hỏi về UI/UX và trải nghiệm người dùng

11. **Giải thích cách bạn thiết kế giao diện người dùng để đảm bảo trải nghiệm tốt trên cả desktop và mobile. Bạn đã áp dụng những nguyên tắc responsive design nào?**
    
    *In English: Explain how you designed the user interface to ensure a good experience on both desktop and mobile. What responsive design principles have you applied?*

12. **Bạn đã tối ưu hóa hiệu suất của ứng dụng như thế nào? Có những kỹ thuật cụ thể nào bạn đã áp dụng để giảm thời gian tải trang?**
    
    *In English: How have you optimized the performance of your application? Are there specific techniques you've applied to reduce page load time?*

13. **Giải thích quy trình thanh toán trong ứng dụng của bạn. Bạn đã tích hợp PayPal như thế nào và xử lý các trường hợp lỗi ra sao?**
    
    *In English: Explain the checkout process in your application. How did you integrate PayPal and handle error cases?*

## Câu hỏi về testing và deployment

14. **Bạn đã thực hiện testing cho ứng dụng như thế nào? Có những loại test nào được áp dụng (unit test, integration test, e2e test)?**
    
    *In English: How did you implement testing for your application? What types of tests were applied (unit tests, integration tests, e2e tests)?*

15. **Giải thích quy trình deployment của dự án. Bạn đã sử dụng CI/CD không và nếu có thì bạn đã cấu hình như thế nào?**
    
    *In English: Explain the deployment process of the project. Did you use CI/CD and if so, how did you configure it?*

## Câu hỏi về kiến thức chuyên sâu

16. **Giải thích cách bạn xử lý việc tải lên hình ảnh sản phẩm sử dụng Cloudinary. Tại sao bạn chọn Cloudinary thay vì lưu trữ trực tiếp trên server?**
    
    *In English: Explain how you handle product image uploads using Cloudinary. Why did you choose Cloudinary instead of storing directly on the server?*

17. **Bạn đã xử lý vấn đề quản lý giỏ hàng như thế nào? Làm thế nào để đảm bảo dữ liệu giỏ hàng được đồng bộ giữa các phiên đăng nhập?**
    
    *In English: How did you handle the shopping cart management? How do you ensure cart data is synchronized between login sessions?*

18. **Giải thích cách bạn xử lý các trạng thái khác nhau của đơn hàng (pending, processing, shipped, delivered, completed). Làm thế nào để đảm bảo tính nhất quán của dữ liệu?**
    
    *In English: Explain how you handle different order statuses (pending, processing, shipped, delivered, completed). How do you ensure data consistency?*

## Câu hỏi về phát triển trong tương lai

19. **Nếu được yêu cầu mở rộng dự án để hỗ trợ đa ngôn ngữ, bạn sẽ thực hiện như thế nào? Những thay đổi cần thiết là gì?**
    
    *In English: If required to expand the project to support multiple languages, how would you implement it? What necessary changes would be needed?*

20. **Nếu số lượng người dùng tăng lên đáng kể, bạn sẽ tối ưu hóa ứng dụng như thế nào để đảm bảo hiệu suất? Những kỹ thuật cụ thể nào bạn sẽ áp dụng?**
    
    *In English: If the number of users increases significantly, how would you optimize the application to ensure performance? What specific techniques would you apply?*
