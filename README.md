# BanHang — Hệ thống bán hàng (React + ASP.NET Core 8 + MySQL)

Hướng dẫn nhanh để chạy, phát triển, và đẩy mã nguồn lên GitHub.

---

## Yêu cầu

- .NET SDK 8.0
- Node.js v18+
- MySQL Server (local hoặc Docker)

---

## Cấu hình cơ sở dữ liệu

1. Khởi động MySQL Server.
2. Tạo database `banhang_db` (nếu cần).
3. Cập nhật kết nối trong `backend/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=banhang_db;User=root;Password=YOUR_PASSWORD_HERE;"
}
```

---

## Chạy dự án

1. Backend (API)

```
cd backend
dotnet run
```

API mặc định sẽ chạy tại `http://localhost:5102` và Swagger ở `http://localhost:5102/swagger`.

2. Frontend (React + Vite)

```
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy tại `http://localhost:5173`.

---

## Tài khoản mẫu

- Customer: `customer` / `customer123`
- Admin: `admin` / `admin123`

---

