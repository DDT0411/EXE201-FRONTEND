# HƯỚNG DẪN CHI TIẾT - LUỒNG THANH TOÁN PREMIUM

## 📋 Mục lục
1. [Tổng quan luồng thanh toán](#tổng-quan-luồng-thanh-toán)
2. [Các API được sử dụng](#các-api-được-sử-dụng)
3. [Chi tiết từng bước](#chi-tiết-từng-bước)
4. [Query Parameters](#query-parameters)
5. [Response Formats](#response-formats)
6. [Error Handling](#error-handling)
7. [Các trường hợp đặc biệt](#các-trường-hợp-đặc-biệt)

---

## 🎯 Tổng quan luồng thanh toán

Luồng thanh toán Premium sử dụng **PayOS** làm cổng thanh toán. Quy trình bao gồm các bước sau:

```
1. User chọn gói Premium tại /choose-plan
   ↓
2. Frontend gọi API tạo thanh toán → Nhận checkoutUrl từ PayOS
   ↓
3. Mở checkoutUrl trong tab mới → User thanh toán trên PayOS
   ↓
4. PayOS redirect về /payment/success với query params
   ↓
5. Frontend verify thanh toán với Backend
   ↓
6. Hiển thị kết quả và kích hoạt Premium
```

---

## 🔌 Các API được sử dụng

### 1. **Tạo thanh toán Premium** (POST)

**Frontend Function:** `createPremiumPayment()` trong `lib/api.ts`

**Next.js API Route:** `/api/payment/premium`

**Backend API:** `POST {API_BASE_URL}/Payment/premium`

**Chức năng:**
- Tạo một đơn hàng thanh toán Premium trên PayOS
- Nhận `checkoutUrl` để redirect user đến trang thanh toán PayOS
- Nhận `qrCode` và `orderCode` từ PayOS

**Request:**
```typescript
// Query Parameters (optional)
ReturnUrl?: string  // URL redirect sau khi thanh toán thành công
CancelUrl?: string  // URL redirect khi user hủy thanh toán

// Headers
Authorization: Bearer {token}
```

**Response:**
```typescript
interface PremiumCheckout {
  checkoutUrl: string  // URL thanh toán PayOS
  qrCode: string       // QR code để quét thanh toán
  orderCode: number    // Mã đơn hàng PayOS
}
```

**Ví dụ:**
```typescript
const checkout = await createPremiumPayment(
  {
    ReturnUrl: "https://eatit-two.vercel.app/payment/success",
    CancelUrl: "https://eatit-two.vercel.app/choose-plan"
  },
  token
)
// Mở checkoutUrl trong tab mới
window.open(checkout.checkoutUrl, "_blank")
```

---

### 2. **Verify thanh toán thành công** (GET)

**Frontend Function:** `getPaymentSuccess()` trong `lib/api.ts`

**Next.js API Route:** `/api/payment/success?orderCode={orderCode}`

**Backend API:** `GET {API_BASE_URL}/Payment/success?orderCode={orderCode}`

**Chức năng:**
- Verify với Backend rằng thanh toán đã thành công
- Backend sẽ kích hoạt Premium cho user
- Trả về kết quả xác thực

**Request:**
```typescript
// Query Parameters
orderCode: string  // Mã đơn hàng từ PayOS

// Headers
Authorization: Bearer {token}
```

**Response:**
```typescript
interface PaymentSuccessResponse {
  success: boolean      // true nếu thanh toán thành công
  message: string       // Thông báo kết quả
  orderCode: string     // Mã đơn hàng
  status: string        // Trạng thái thanh toán
}
```

**Ví dụ:**
```typescript
const res = await getPaymentSuccess(orderCode, token)
if (res.success) {
  // Thanh toán thành công, Premium đã được kích hoạt
  console.log("Premium activated!")
}
```

---

### 3. **Lấy lịch sử thanh toán** (GET)

**Frontend Function:** `getPaymentHistory()` trong `lib/api.ts`

**Next.js API Route:** `/api/payment/history`

**Backend API:** `GET {API_BASE_URL}/Payment/history`

**Chức năng:**
- Lấy danh sách tất cả các giao dịch thanh toán của user
- Hiển thị trong trang Profile

**Request:**
```typescript
// Headers
Authorization: Bearer {token}
```

**Response:**
```typescript
interface PaymentHistoryResponse {
  payments: PaymentHistoryItem[]
}

interface PaymentHistoryItem {
  paymentId: number
  orderCode: number
  amount: number
  description: string
  status: string           // "PAID", "PENDING", "CANCELLED"
  paymentType: string
  premiumExpiryDate: string | null
  createdAt: string
  paidAt: string | null
}
```

---

### 4. **Kiểm tra trạng thái Premium** (GET)

**Frontend Function:** `getPremiumStatus()` trong `lib/api.ts`

**Next.js API Route:** `/api/payment/premium-status`

**Backend API:** `GET {API_BASE_URL}/Payment/premium-status`

**Chức năng:**
- Kiểm tra user có đang sở hữu Premium không
- Lấy ngày hết hạn Premium (nếu có)

**Request:**
```typescript
// Headers
Authorization: Bearer {token}
```

**Response:**
```typescript
interface PremiumStatusResponse {
  hasPremium: boolean
  expiryDate: string | null  // ISO date string hoặc null
}
```

---

## 📝 Chi tiết từng bước

### **Bước 1: User chọn gói Premium**

**File:** `app/choose-plan/page.tsx`

**Chức năng:**
- User chọn gói Premium và click "Tiếp tục"
- Kiểm tra user đã đăng nhập chưa
- Nếu chưa đăng nhập → Redirect đến `/login`
- Nếu đã đăng nhập → Tiến hành tạo thanh toán

**Code:**
```typescript
const handleContinue = async () => {
  if (!isAuthenticated || !token) {
    toast.error("Vui lòng đăng nhập để mua Premium")
    router.push("/login")
    return
  }

      const checkout = await createPremiumPayment(
        {
          ReturnUrl: `https://eatit-two.vercel.app/payment/success`,
          CancelUrl: `https://eatit-two.vercel.app/choose-plan`,
        },
        token
      )
      
      if (checkout.checkoutUrl) {
        // ⚠️ QUAN TRỌNG: Lưu orderCode vào localStorage
        // Vì PayOS không gửi orderCode trong query params khi redirect
        if (checkout.orderCode) {
          localStorage.setItem("pending_orderCode", checkout.orderCode.toString())
        }
        window.open(checkout.checkoutUrl, "_blank")
      }
}
```

---

### **Bước 2: Tạo thanh toán và mở PayOS**

**File:** `app/api/payment/premium/route.ts`

**Chức năng:**
- Nhận request từ Frontend với `ReturnUrl` và `CancelUrl`
- Validate và clean URLs
- Gọi Backend API `POST /Payment/premium` với query params
- Trả về `checkoutUrl` từ PayOS

**Flow:**
```
Frontend → /api/payment/premium?ReturnUrl=...&CancelUrl=...
         → Backend API: POST /Payment/premium?ReturnUrl=...&CancelUrl=...
         → PayOS tạo đơn hàng
         → Trả về checkoutUrl
```

**Lưu ý:**
- `ReturnUrl`: URL PayOS sẽ redirect về sau khi thanh toán thành công
- `CancelUrl`: URL PayOS sẽ redirect về nếu user hủy thanh toán

---

### **Bước 3: User thanh toán trên PayOS**

**Chức năng:**
- User được redirect đến trang thanh toán PayOS
- User chọn phương thức thanh toán và hoàn tất
- PayOS xử lý thanh toán

**Kết quả:**
- Nếu thành công: PayOS redirect về `ReturnUrl` với query params
- Nếu hủy: PayOS redirect về `CancelUrl` với `cancel=true`

---

### **Bước 4: PayOS redirect về Payment Success Page**

**File:** `app/payment/success/page.tsx`

**URL thực tế từ PayOS:** 
```
/payment/success?code=00&id=0f4011969f3f407a87d7ca7676a
```

**⚠️ LƯU Ý QUAN TRỌNG:**
- PayOS **KHÔNG** gửi `orderCode` trong query params khi redirect
- PayOS chỉ gửi: `code`, `id`, `status` (nếu có), `cancel` (nếu có)
- `orderCode` được lưu vào `localStorage` khi tạo thanh toán (bước 1)
- Khi vào success page, lấy `orderCode` từ `localStorage` thay vì query params

**Query Parameters từ PayOS:**

| Parameter | Mô tả | Giá trị có thể | Bắt buộc |
|-----------|-------|----------------|----------|
| `code` | Mã kết quả PayOS | `"00"` = thành công, khác = lỗi | ✅ Có |
| `id` | Transaction ID PayOS | String | ✅ Có |
| `status` | Trạng thái thanh toán | `"PAID"`, `"PENDING"`, `"CANCELLED"` | ❌ Không (tùy chọn) |
| `cancel` | User có hủy không | `"true"` hoặc `"false"` | ❌ Không (tùy chọn) |
| `orderCode` | ❌ **KHÔNG có** | - | ❌ PayOS không gửi |

**Cách lấy orderCode:**
```typescript
// Lấy từ localStorage (đã lưu khi tạo thanh toán)
const orderCode = localStorage.getItem("pending_orderCode")

// Sau khi lấy xong, xóa khỏi localStorage
localStorage.removeItem("pending_orderCode")
```

**Chức năng của trang:**
1. Lấy `orderCode` từ `localStorage` (không phải từ query params)
2. Đọc query parameters từ PayOS: `code`, `id`, `status`, `cancel`
3. Kiểm tra nếu `cancel === "true"` → Hiển thị thông báo hủy
4. Kiểm tra nếu `code === "00"` → Thanh toán thành công (PayOS báo thành công)
5. Gọi API verify với Backend bằng `orderCode` từ localStorage
6. Hiển thị kết quả và kích hoạt Premium

---

### **Bước 5: Verify thanh toán với Backend**

**File:** `app/api/payment/success/route.ts`

**Chức năng:**
- Nhận `orderCode` từ query params
- Gọi Backend API `GET /Payment/success?orderCode={orderCode}`
- Backend verify với PayOS và kích hoạt Premium cho user
- Trả về kết quả

**Flow:**
```
Frontend → /api/payment/success?orderCode=123456
         → Backend API: GET /Payment/success?orderCode=123456
         → Backend verify với PayOS
         → Backend kích hoạt Premium
         → Trả về { success: true, message: "..." }
```

**Response từ Backend:**
```typescript
{
  success: true,
  message: "Payment verified and Premium activated",
  orderCode: "123456",
  status: "PAID"
}
```

---

### **Bước 6: Hiển thị kết quả**

**File:** `app/payment/success/page.tsx`

**Các trạng thái:**

1. **Đang xử lý (`isProcessing = true`):**
   - Hiển thị spinner loading
   - Text: "Đang kiểm tra thanh toán..."

2. **Thanh toán thành công (`isSuccess = true`):**
   - Hiển thị card màu xanh lá với checkmark
   - Title: "Thanh toán thành công 🎉"
   - Description: "Cảm ơn bạn đã hoàn tất thanh toán. Hệ thống đã ghi nhận giao dịch của bạn."
   - Hiển thị mã đơn hàng
   - 2 nút:
     - "Về trang chủ" → `/`
     - "Xem đơn hàng" → `/profile`

3. **Thanh toán bị hủy (`cancel === "true"`):**
   - Hiển thị thông báo hủy
   - Auto redirect về `/choose-plan` sau 2 giây

4. **Thanh toán thất bại:**
   - Hiển thị thông báo lỗi
   - Auto redirect về `/choose-plan` sau 2 giây

---

## 🔍 Query Parameters

### **PayOS Redirect Parameters**

⚠️ **LƯU Ý QUAN TRỌNG:** PayOS **KHÔNG** gửi `orderCode` trong query params!

Khi PayOS redirect về `/payment/success`, các query params thực tế:

```typescript
{
  code: string        // "00" = thành công, khác = lỗi ✅ BẮT BUỘC
  id: string          // Transaction ID PayOS ✅ BẮT BUỘC
  status?: string     // "PAID" | "PENDING" | "CANCELLED" (tùy chọn)
  cancel?: string     // "true" | "false" (tùy chọn)
  // orderCode: KHÔNG CÓ ❌
}
```

**Ví dụ URL thực tế từ PayOS:**
```
/payment/success?code=00&id=0f4011969f3f407a87d7ca7676a
```

**Cách lấy orderCode:**
- `orderCode` được lưu vào `localStorage` khi tạo thanh toán
- Key: `"pending_orderCode"`
- Lấy từ localStorage khi vào success page
- Xóa khỏi localStorage sau khi sử dụng

---

## 📦 Response Formats

### **1. PremiumCheckout Response**

```typescript
{
  checkoutUrl: "https://pay.payos.vn/web/...",
  qrCode: "data:image/png;base64,...",
  orderCode: 1763047373
}
```

### **2. PaymentSuccessResponse**

```typescript
{
  success: true,
  message: "Payment verified and Premium activated",
  orderCode: "1763047373",
  status: "PAID"
}
```

### **3. PaymentHistoryResponse**

```typescript
{
  payments: [
    {
      paymentId: 1,
      orderCode: 1763047373,
      amount: 29000,
      description: "Premium subscription",
      status: "PAID",
      paymentType: "PayOS",
      premiumExpiryDate: "2024-12-31T23:59:59Z",
      createdAt: "2024-01-01T10:00:00Z",
      paidAt: "2024-01-01T10:05:00Z"
    }
  ]
}
```

### **4. PremiumStatusResponse**

```typescript
{
  hasPremium: true,
  expiryDate: "2024-12-31T23:59:59Z"
}
```

---

## ⚠️ Error Handling

### **1. User chưa đăng nhập**

**Khi tạo thanh toán:**
- Frontend kiểm tra `isAuthenticated` và `token`
- Nếu chưa đăng nhập → Redirect đến `/login`

**Khi verify thanh toán:**
- Nếu user chưa đăng nhập nhưng thanh toán thành công
- Hiển thị: "Thanh toán thành công! Vui lòng đăng nhập để kích hoạt Premium."
- Auto redirect đến `/login` sau 2 giây

---

### **2. Thiếu orderCode**

**Khi verify:**
- Nếu `orderCode` không có trong localStorage (đã bị xóa hoặc chưa lưu)
- Hiển thị: "Thiếu mã đơn hàng (orderCode). Vui lòng kiểm tra lại lịch sử thanh toán."
- Vẫn hiển thị thành công (vì PayOS đã báo thành công)
- Redirect đến `/profile` để user xem lịch sử thanh toán
- User có thể verify thủ công bằng cách xem payment history

---

### **3. Verify thất bại**

**Khi Backend verify thất bại:**
- Nếu PayOS báo `PAID` nhưng Backend verify fail
- Vẫn tin tưởng PayOS (vì PayOS là nguồn chính thức)
- Hiển thị: "Thanh toán thành công! Vui lòng đăng nhập để kích hoạt Premium."
- Redirect đến `/login`

---

### **4. Thanh toán bị hủy**

**Khi `cancel === "true"`:**
- Hiển thị: "Thanh toán đã bị hủy."
- Auto redirect về `/choose-plan` sau 2 giây

---

### **5. Thanh toán thất bại**

**Khi `status !== "PAID"` hoặc `code !== "00"`:**
- Hiển thị: "Thanh toán không thành công. Vui lòng thử lại."
- Auto redirect về `/choose-plan` sau 2 giây

---

## 🎨 Các trường hợp đặc biệt

### **1. User đã có Premium**

**File:** `app/choose-plan/page.tsx`

**Chức năng:**
- Khi vào trang `/choose-plan`, kiểm tra Premium status
- Nếu đã có Premium → Hiển thị toast và redirect về `/`

```typescript
useEffect(() => {
  if (isAuthenticated && token) {
    getPremiumStatus(token)
      .then((status) => {
        if (status.hasPremium) {
          toast.info("Bạn đã có gói Premium rồi!")
          router.push("/")
        }
      })
  }
}, [isAuthenticated, token])
```

---

### **2. Admin không cần mua Premium**

**File:** `app/choose-plan/page.tsx`

**Chức năng:**
- Kiểm tra nếu user là Admin (`roleName === "Admin"` hoặc `roleId === 1`)
- Redirect đến `/admin` và hiển thị thông báo

```typescript
if (user && (user.roleName === "Admin" || user.roleId === 1)) {
  toast.error("Admin không cần mua gói Premium")
  router.push("/admin")
}
```

---

### **3. Auto redirect sau thanh toán**

**Trước đây:**
- Sau khi thanh toán thành công, auto redirect về trang chủ sau 2 giây

**Hiện tại:**
- Không auto redirect
- User tự chọn: "Về trang chủ" hoặc "Xem đơn hàng"

**Lý do:**
- User có thể muốn xem thông tin đơn hàng ngay
- Tránh redirect quá nhanh làm user bối rối

---

### **4. Payment History trong Profile**

**File:** `app/profile/page.tsx`

**Chức năng:**
- Hiển thị lịch sử thanh toán của user
- Lấy từ API `getPaymentHistory(token)`
- Hiển thị trong tab Settings

**Thông tin hiển thị:**
- OrderCode
- Trạng thái (PAID/PENDING/CANCELLED)
- Ngày tạo
- Ngày thanh toán (nếu có)

---

## 📁 Cấu trúc Files

```
app/
├── choose-plan/
│   └── page.tsx                    # Trang chọn gói Premium
├── payment/
│   └── success/
│       └── page.tsx                # Trang kết quả thanh toán
└── api/
    └── payment/
        ├── premium/
        │   └── route.ts            # API tạo thanh toán
        ├── success/
        │   └── route.ts            # API verify thanh toán
        ├── history/
        │   └── route.ts            # API lịch sử thanh toán
        └── premium-status/
            └── route.ts            # API kiểm tra Premium status

lib/
└── api.ts                          # Các hàm gọi API payment
```

---

## 🔐 Security Notes

1. **Token Authentication:**
   - Tất cả API đều yêu cầu `Authorization: Bearer {token}`
   - Token được lấy từ `useAuth()` hook

2. **URL Validation:**
   - `ReturnUrl` và `CancelUrl` được validate và clean trước khi gửi đến Backend
   - Chỉ chấp nhận URLs bắt đầu với `http://` hoặc `https://`

3. **OrderCode Verification:**
   - Luôn verify `orderCode` với Backend trước khi kích hoạt Premium
   - Không tin tưởng hoàn toàn vào query params từ PayOS

---

## 🧪 Testing

### **Test Cases:**

1. **Thanh toán thành công:**
   - User đã đăng nhập → Chọn Premium → Thanh toán → Verify thành công

2. **Thanh toán thành công nhưng chưa đăng nhập:**
   - User chưa đăng nhập → Thanh toán → Redirect về success page → Yêu cầu đăng nhập

3. **Hủy thanh toán:**
   - User click hủy trên PayOS → Redirect về với `cancel=true` → Hiển thị thông báo hủy

4. **Thanh toán thất bại:**
   - PayOS trả về `status !== "PAID"` → Hiển thị thông báo lỗi

5. **Verify thất bại:**
   - PayOS báo thành công nhưng Backend verify fail → Vẫn hiển thị thành công, yêu cầu đăng nhập

---

## 📞 Support

Nếu có vấn đề với thanh toán, kiểm tra:

1. **Console logs:**
   - Xem query params từ PayOS
   - Xem response từ Backend API

2. **Network tab:**
   - Kiểm tra request/response của các API calls
   - Xem status codes và error messages

3. **Backend logs:**
   - Kiểm tra logs từ Backend API
   - Xem có lỗi khi verify với PayOS không

---

## 📝 Changelog

### **Version 1.0 (Current)**
- ✅ Tích hợp PayOS payment gateway
- ✅ Trang payment success với UI đẹp
- ✅ Verify thanh toán với Backend
- ✅ Payment history trong Profile
- ✅ Premium status checking
- ✅ Error handling đầy đủ

---

**Tài liệu này được cập nhật lần cuối:** [Ngày hiện tại]

**Người tạo:** AI Assistant

**Phiên bản:** 1.0

