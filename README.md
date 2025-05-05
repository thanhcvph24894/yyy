# Shop App

Ứng dụng thương mại điện tử được xây dựng bằng Node.js, MongoDB và React Native.

## Cấu trúc dự án

```
ShopApp
├── backend                # Backend (Node.js + MongoDB)
│   ├── controllers/      # Logic xử lý API
│   │   └── api/         # API controllers cho mobile
│   ├── middleware/      # Middleware (auth, error handling)
│   │   └── api/        # API middleware cho mobile
│   ├── models/         # MongoDB models
│   ├── routes/         # Routes
│   │   └── api/       # API routes cho mobile
│   └── uploads/       # Thư mục chứa files upload
│
└── frontend           # Frontend (React Native)
    ├── src/          # Source code
    │   ├── screens/  # Màn hình
    │   ├── components/ # Components
    │   ├── navigation/ # React Navigation
    │   ├── services/   # API calls
    │   └── utils/      # Utilities
    ├── android/        # Android files
    └── ios/           # iOS files
```

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
- MongoDB
- React Native development environment
- Android Studio (cho Android)
- Xcode (cho iOS, chỉ trên macOS)

## Cài đặt và Chạy

### Backend

1. Clone repository và cài đặt dependencies:
```bash
cd backend
npm install
```

2. Tạo file .env với nội dung:
```
NODE_ENV=development
PORT=5001
BASE_URL=http://localhost:5001
MONGODB_URI=mongodb://localhost:27017/shopquanao
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

3. Chạy migration để tạo dữ liệu mẫu:
```bash
node migrations/index.js
```

4. Khởi động server:
```bash
npm run dev
```

Server sẽ chạy tại http://localhost:5001

### Frontend

1. Cài đặt dependencies:
```bash
cd frontend
npm install
```

2. Cấu hình API endpoint trong `src/config/index.js`:
```javascript
export const API_URL = 'http://localhost:5001/api/v1';
```

3. Chạy ứng dụng:
```bash
# Khởi động Metro bundler
npm start

# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios
```

## API Documentation

### Authentication APIs

1. Đăng ký:
```
POST /api/v1/auth/register
Content-Type: application/json

{
    "name": "Người dùng",
    "email": "user@example.com",
    "password": "123456",
    "phone": "0123456789"
}
```

2. Đăng nhập:
```
POST /api/v1/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "123456"
}
```

3. Lấy thông tin user:
```
GET /api/v1/auth/me
Authorization: Bearer <token>
```

4. Cập nhật thông tin:
```
PUT /api/v1/auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Tên mới",
    "phone": "0987654321",
    "address": "Địa chỉ mới"
}
```

### Product APIs

1. Lấy danh sách sản phẩm:
```
GET /api/v1/products
Query params:
- page: Số trang (mặc định: 1)
- limit: Số sản phẩm mỗi trang (mặc định: 10)
- category: ID danh mục
```

2. Lấy chi tiết sản phẩm:
```
GET /api/v1/products/:slug
```

### Category APIs

1. Lấy danh sách danh mục:
```
GET /api/v1/categories
```

## Tài khoản mặc định

1. Admin:
```
Email: admin@gmail.com
Password: 123456789
```

2. User:
```
Email: nguyenvana@example.com
Password: 123456
```

## Lưu ý

1. Backend:
- Đảm bảo MongoDB đang chạy trước khi khởi động server
- Chạy migration để có dữ liệu mẫu
- Upload files sẽ được lưu trong thư mục `/uploads`

2. Frontend:
- Sử dụng React Navigation v6 cho điều hướng
- Lưu token trong AsyncStorage
- Có thể test API bằng Postman trước khi tích hợp vào app