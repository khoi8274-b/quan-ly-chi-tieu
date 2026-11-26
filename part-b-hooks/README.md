-Mã sinh viên : B25DCTV043 


-Họ và tên : Trịnh Đăng Khôi 


-Cách chạy : clone toàn bộ file về máy và chạy fule Run-b .bat

## Hooks đã giúp khắc phục các thách thức của Class Component ở những chỗ nào trong bài?

1. **Gom nhóm logic vòng đời & tránh rò rỉ bộ nhớ (`useEffect`):**
   - *Ở Class (Phần A):* Logic của một tính năng bị tách rời ra nhiều phương thức. Đồng hồ phải tạo `setInterval` ở `componentDidMount` nhưng lại phải sang `componentWillUnmount` để `clearInterval`; tiêu đề tab (`document.title`) phải cập nhật lặp lại ở cả `componentDidMount` và `componentDidUpdate` kèm câu lệnh `if` so sánh `prevState` thủ công.
   - *Ở Hooks (Phần B):* `useEffect` đặt phần khởi tạo và hàm dọn dẹp (`return () => clearInterval(...)`) ngay cạnh nhau giúp tránh quên hủy timer khi ẩn đồng hồ. Đồng thời, mảng dependency `[expenses]` tự động theo dõi thay đổi để cập nhật tiêu đề tab gọn gàng hơn.

2. **Tái sử dụng logic có trạng thái qua Custom Hooks (`useFetch`, `useClock`, `useDebounce`):**
   - *Ở Class:* Khi mở rộng sang gọi MockAPI kèm trạng thái `loading` và `error`, Class Component khó tách riêng phần xử lý dữ liệu này khỏi giao diện nếu không dùng các kỹ thuật phức tạp như HOC hoặc Render Props.
   - *Ở Hooks:* Toàn bộ logic gọi API (`GET/POST/DELETE`), đếm giờ và tạo độ trễ tìm kiếm được đóng gói độc lập thành các Custom Hooks (`useFetch`, `useClock`, `useDebounce`), giúp code giao diện trong `App` ngắn gọn và dễ bảo trì.

3. **Chia sẻ state xuyên cấp không cần truyền props thủ công (`useContext`):**
   - *Ở Class:* Để áp dụng chế độ Sáng/Tối cho nhiều component con (Header, Form, Bảng chi tiêu), phải truyền props qua nhiều tầng trung gian (prop drilling).
   - *Ở Hooks:* `useContext` cho phép các component truy cập trực tiếp trạng thái giao diện Sáng/Tối thông qua `useTheme()`.

4. **Loại bỏ sự phức tạp của `this` & thao tác DOM trực tiếp (`useRef`):**
   - *Ở Class:* Phải khai báo `constructor`, `super(props)` và dễ gặp lỗi mất ngữ cảnh con trỏ `this` khi truyền hàm xử lý sự kiện xuống component con.
   - *Ở Hooks:* Không còn từ khóa `this`, việc tự động focus vào ô nhập nội dung sau khi thêm khoản chi được thực hiện trực tiếp và ngắn gọn qua `useRef`.
