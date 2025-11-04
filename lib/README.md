# API Setup và Usage Guide

## Cấu trúc thư mục

```
lib/
├── axios.ts              # Cấu hình axios với interceptors
├── config.ts             # Cấu hình environment variables
├── types/
│   └── api.ts           # TypeScript types cho API
├── services/
│   ├── index.ts         # Export tất cả services
│   ├── api.service.ts   # Base API service class
│   ├── auth.service.ts  # Authentication service
│   ├── food.service.ts  # Food management service
│   └── order.service.ts # Order management service
└── README.md           # Hướng dẫn sử dụng
```

## Cài đặt Environment Variables

Tạo file `.env.local` trong root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key

# App Configuration
NEXT_PUBLIC_APP_NAME=EXE201 Food App
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Cách sử dụng

### 1. Import services

```typescript
import { authService, foodService, orderService } from '@/lib/services';
```

### 2. Sử dụng trong components

```typescript
import { useApi } from '@/hooks/use-api';
import { authService } from '@/lib/services';

function LoginComponent() {
  const { data, loading, error, execute } = useApi();

  const handleLogin = async (credentials) => {
    try {
      await execute(() => authService.login(credentials));
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    // Your component JSX
  );
}
```

### 3. Sử dụng với pagination

```typescript
import { usePaginatedApi } from '@/hooks/use-api';
import { foodService } from '@/lib/services';

function FoodListComponent() {
  const { data, pagination, loading, execute, loadMore, hasMore } = usePaginatedApi();

  useEffect(() => {
    execute((page, limit) => foodService.getFoods({ page, limit }));
  }, []);

  return (
    // Your component JSX
  );
}
```

## API Services

### AuthService

- `login(credentials)` - Đăng nhập
- `register(userData)` - Đăng ký
- `getProfile()` - Lấy thông tin user
- `updateProfile(userData)` - Cập nhật profile
- `logout()` - Đăng xuất
- `refreshToken()` - Refresh token
- `forgotPassword(email)` - Quên mật khẩu
- `resetPassword(data)` - Reset mật khẩu

### FoodService

- `getFoods(pagination)` - Lấy danh sách món ăn
- `getFoodById(id)` - Lấy món ăn theo ID
- `searchFoods(query, pagination)` - Tìm kiếm món ăn
- `getCategories()` - Lấy danh mục món ăn
- `createFood(foodData)` - Tạo món ăn mới (admin)
- `updateFood(id, foodData)` - Cập nhật món ăn (admin)
- `deleteFood(id)` - Xóa món ăn (admin)

### OrderService

- `getOrders(pagination)` - Lấy danh sách đơn hàng
- `createOrder(orderData)` - Tạo đơn hàng mới
- `getOrderById(id)` - Lấy đơn hàng theo ID
- `cancelOrder(id, reason)` - Hủy đơn hàng
- `getOrderTracking(id)` - Theo dõi đơn hàng

## Error Handling

Axios đã được cấu hình với interceptors để xử lý lỗi tự động:

- **401 Unauthorized**: Tự động xóa token và redirect về login
- **403 Forbidden**: Log lỗi access denied
- **404 Not Found**: Log lỗi resource not found
- **500 Server Error**: Log lỗi server
- **Network Error**: Log lỗi network

## Authentication

Token được tự động thêm vào header của mọi request. Khi token hết hạn, có thể sử dụng `refreshToken()` để lấy token mới.

## Development

Trong development mode, tất cả API requests và responses sẽ được log ra console để dễ debug.

## Types

Tất cả types được định nghĩa trong `lib/types/api.ts` để đảm bảo type safety khi sử dụng API.
