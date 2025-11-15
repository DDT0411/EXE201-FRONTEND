# HƯỚNG DẪN LUỒNG CHỨC NĂNG & API

Tài liệu này mô tả toàn bộ luồng chính trong dự án EatIT (frontend Next.js 15, backend `https://huyrepo.onrender.com`). Mỗi phần ghi rõ vai trò, trang liên quan và API được gọi.

---

## 1. Thiết lập môi trường

| Biến môi trường | Vai trò | Ghi chú |
| --------------- | ------- | ------- |
| `NEXT_PUBLIC_GOONG_MAPS_API_KEY` | Map Tiles Key để render Goong Map | chỉ dùng cho bản đồ |
| `GOONG_MAPS_REST_API_KEY` | REST API Key để gọi Geocoding (qua `/api/goong/geocode`) | lưu ở server-side `.env.local` |
| `NEXT_PUBLIC_API_BASE_URL` (nếu dùng) | Trỏ tới backend OnRender | hiện hardcode trong `lib/api.ts` |

Frontend không gọi trực tiếp REST key; mọi request geocoding đi qua API routes Next.js.

---

## 2. Đăng ký / Đăng nhập / Hồ sơ

### Trang & component
- `app/login`, `app/signup`, `app/profile`
- Hook `useAuth` trong `hooks/use-auth.ts`

### API chính
| Chức năng | API (backend) | Phương thức |
| --------- | ------------- | ----------- |
| Đăng ký người dùng | `POST /api/Auth/register` | truyền `email`, `password`, `name` |
| Đăng nhập lấy JWT | `POST /api/Auth/login` | lưu token trong localStorage |
| Đổi mật khẩu | `PUT /api/Auth/change-password` | yêu cầu token |
| Quên mật khẩu | `POST /api/Auth/forgot-password` / `POST /api/Auth/reset-password` | gửi mail + đặt lại |
| Lấy thông tin hồ sơ | `GET /api/User/profile` | hiển thị ở `app/profile` |

---

## 3. Khám phá quán ăn & món ăn

### Danh sách
- `app/menu`, `app/tag/[id]`, `app/restaurant/[id]`, `app/food/[id]`
- Dữ liệu lấy qua `lib/api.ts`

### API chính
| Chức năng | API | Ghi chú |
| --------- | --- | ------- |
| Lấy danh sách món ăn | `GET /api/Dish/dishes` | hỗ trợ filter `search`, `sort` |
| Lấy chi tiết món | `GET /api/Dish/dishes/{dishId}` | dùng trong trang `app/food/[id]` |
| Lấy danh sách quán | `GET /api/Restaurant/nearby` hoặc `GET /api/Restaurant/restaurants/{id}` | trang chi tiết quán |
| Rating quán | `GET/POST /api/Rating/restaurants/{restaurantId}/ratings` | hiển thị & tạo đánh giá |

---

## 4. Yêu thích (Favorites)

### Trang `app/favorites/page.tsx`
Quy ước mới:
- Mỗi phần tử yêu thích phải có `favorite.id` (ID favorite record) và **nếu** backend trả `dishId` thì mới cho phép click sang trang món ăn.
- Nếu thiếu `dishId`, card vẫn hiển thị nhưng không có link; người dùng chỉ có thể xem thông tin & xoá.

### API
| Chức năng | API | Ghi chú |
| --------- | --- | ------- |
| Lấy danh sách yêu thích | `GET /api/Favorite/users/{userId}/favorites` |
| Thêm yêu thích | `POST /api/Favorite/favorites` |
| Xoá yêu thích | `DELETE /api/Favorite/favorites/{favoriteId}` |

Khi backend cập nhật để trả `dishId`, UI tự động cho phép điều hướng (`/food/{dishId}`).

---

## 5. Bản đồ & định vị

### Thành phần chính
- `components/restaurant-map.tsx`
- `app/restaurant/[id]` sử dụng `RestaurantMap`

### Dữ liệu
- Ưu tiên lấy `latitude`, `longitude` từ backend (ví dụ `GET /api/Restaurant/restaurants/{id}`).
- Nếu thiếu, frontend gọi API route `GET /api/goong/geocode?address={...}`:
  - Route này dùng `GOONG_MAPS_REST_API_KEY` để gọi `https://rsapi.goong.io/Geocode`.
  - Trả về `{ lat, lng, formatted_address }`, cập nhật vào state quán ăn.

### Hiển thị
- Dùng `@goongmaps/goong-map-react` để render bản đồ.
- Marker React được căn giữa với `offsetLeft`/`offsetTop` nên luôn cố định trên bản đồ ngay cả khi kéo/zoom.

---

## 6. Định vị người dùng & khoảng cách

### Thành phần
- `components/geolocation-request.tsx` xin quyền định vị và lưu vào localStorage.
- APIs trong `lib/api.ts`:
  - `GET /api/User/location` (lưu vị trí user lên backend nếu cần).
  - `POST /api/Restaurant/distance` để tính khoảng cách giữa điểm hiện tại và quán.

---

## 7. Thanh toán Premium (PayOS)

### Trang & file
- `app/choose-plan/page.tsx`: tạo order, lưu `orderCode` vào `localStorage`.
- `app/payment/success/page.tsx`: đọc `orderCode` từ `localStorage` để xác minh.
- Tài liệu chi tiết: `HUONG_DAN_THANH_TOAN.md`.

### API flow
1. Frontend gọi `POST /api/payment/premium?ReturnUrl=...&CancelUrl=...` (API route Next) → gọi tiếp backend `POST /api/Payment/premium`.
2. Backend trả `{ checkoutUrl, qrCode, orderCode }`.
3. Frontend redirect user tới `checkoutUrl`.
4. PayOS redirect về `/payment/success` với trạng thái; frontend lấy `orderCode` đã lưu, gọi `GET /api/payment/premium-status?orderCode=...` (nếu có) rồi hiển thị kết quả.
5. `HUONG_DAN_THANH_TOAN.md` mô tả cụ thể các parameter, cách xử lý lỗi.

---

## 8. Đánh giá (Ratings)

### Trang
- `app/restaurant/[id]` hiển thị danh sách bình luận, form gửi đánh giá.

### API
| Chức năng | API |
| --------- | --- |
| Lấy danh sách đánh giá | `GET /api/Rating/restaurants/{restaurantId}/ratings` |
| Tạo đánh giá mới | `POST /api/Rating/restaurants/{restaurantId}/ratings` (yêu cầu token) |
| Xoá/cập nhật (nếu có) | `DELETE /api/Rating/ratings/{id}` / `PUT ...` |

---

## 9. Trang Admin

### Trang
- `app/admin` (dashboard) + các dialog quản lý món, quán, người dùng...

### API
| Module | API route |
| ------ | --------- |
| Món ăn | `GET/POST/PUT/DELETE /api/admin/dishes` |
| Quán ăn | `.../restaurants` |
| Người dùng | `.../users` |
| Rating | `.../ratings` |
| Thanh toán | `.../payments` |

Tất cả đều ủy quyền lại cho backend `https://huyrepo.onrender.com/api/Admin/...` với JWT Admin.

---

## 10. Kiểm tra chất lượng & deploy

1. `npm install`
2. `npm run build` – đã check, build thành công.
3. Kiểm tra `.env.local` gồm:
   ```
   NEXT_PUBLIC_GOONG_MAPS_API_KEY=...
   GOONG_MAPS_REST_API_KEY=...
   ```
4. Deploy lên Vercel (Next.js 15) hoặc môi trường tùy chọn. Sau deploy cần bật domain của Vercel trong Goong Map Tiles (Allowlist).

---

## 11. Tổng kết

- Khi backend cung cấp `latitude/longitude`, marker hiển thị chính xác và luôn nằm cố định.
- Nếu backend thiếu tọa độ, sử dụng API `GET /api/goong/geocode` một lần rồi lưu lại để tránh phụ thuộc vào REST key phía client.
- Favorites: chỉ cho phép điều hướng khi có `dishId`; các mục khác hiển thị readonly nhưng vẫn xoá được.
- Payment flow: xem `HUONG_DAN_THANH_TOAN.md` để đảm bảo Xử lý `orderCode`.

Tài liệu này sẽ được cập nhật khi xuất hiện luồng mới. Vui lòng mở PR kèm chỉnh sửa nếu bổ sung chức năng.

