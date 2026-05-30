# MK Widget Card - Official Landing Page

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11+-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Đây là mã nguồn của trang **Landing Page** chính thức cho ứng dụng **MK Widget Card**. Trang web được thiết kế với phong cách hiện đại, tối giản (Modern Dark UI), tối ưu hóa trải nghiệm người dùng và sẵn sàng để triển khai thực tế.

---

## 📱 Giới thiệu về MK Widget Card

**MK Widget Card** là một hệ sinh thái định danh kỹ thuật số (Digital Identity) toàn diện cho iOS và Android. Ứng dụng giúp người dùng tạo danh thiếp thông minh (eCard), chia sẻ thông tin qua mã QR vCard và đưa các thông tin quan trọng trực tiếp lên màn hình chính thông qua hệ thống Widget.

> **Lưu ý:** Đây chỉ là repository của trang web giới thiệu. Mã nguồn ứng dụng di động nằm tại: [MK_Widget_Card App Repo](https://github.com/MKTech-CYV/MK_Widget_Card)

---

## ✨ Tính năng nổi bật của Website

- **Giao diện Modern Dark**: Tone màu đen sâu (Black/Zinc) chuyên nghiệp, phù hợp với các sản phẩm công nghệ và AI.
- **Hiệu ứng mượt mà**: Sử dụng Framer Motion cho các hiệu ứng xuất hiện (Reveal), Scan-line và chuyển động của thẻ.
- **Cấu trúc Mô-đun**: Dễ dàng tùy chỉnh nội dung các phần: Tính năng, Gallery ảnh, Hướng dẫn cài đặt.
- **Responsive 100%**: Hiển thị hoàn hảo trên Mobile, Tablet và Desktop.
- **Tối ưu SEO**: Đã cấu hình đầy đủ Metadata, Open Graph, Sitemap và Robots.
- **Dễ dàng cấu hình**: Toàn bộ thông tin quan trọng (Store links, Email, Social) được tập trung tại một nơi.

---

## 🛠 Công nghệ sử dụng

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Font**: Geist Sans & Geist Mono

---

## 🚀 Bắt đầu nhanh

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.0 trở lên.
- **Trình quản lý gói**: npm hoặc yarn.

### 2. Cài đặt
```bash
# Clone repository
git clone https://github.com/MKTech-CYV/MK_Widget_Card_Website.git

# Di chuyển vào thư mục dự án
cd MK_Widget_Card_Website

# Cài đặt các thư viện phụ thuộc
npm install
```

### 3. Chạy môi trường phát triển
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

---

## ⚙️ Cấu hình thông tin cá nhân

Để thay đổi thông tin trên trang web, bạn chỉ cần chỉnh sửa các hằng số ở đầu file:
`src/components/landing/constants.ts`

```typescript
export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.mktech.widgetcard";
export const APP_STORE_URL = "https://apps.apple.com/us/app/mk-widget-card-qr-ng%C3%A2n-h%C3%A0ng/id6768935113";
```

### Thêm ảnh vào Gallery
1. Chép ảnh vào thư mục `public/gallery/`.
2. Đổi tên ảnh thành `setup.png`, `qr.png`, `widget.png`, `scan.png`.
3. Website sẽ tự động nhận diện và hiển thị ảnh với hiệu ứng hover.

---

## 📦 Triển khai (Deployment)

Dự án được tối ưu hóa tốt nhất cho nền tảng **Vercel**:

1. Đẩy mã nguồn lên GitHub/GitLab/Bitbucket.
2. Kết nối dự án trên dashboard của Vercel.
3. Cấu hình biến môi trường `NEXT_PUBLIC_SITE_URL` (nếu cần).
4. Nhấn **Deploy**.

---

## 🤝 Đóng góp

Mọi đóng góp nhằm cải thiện trang web đều được trân trọng.
1. Fork dự án.
2. Tạo nhánh tính năng (`git checkout -b feature/AmazingFeature`).
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`).
4. Push lên nhánh (`git push origin feature/AmazingFeature`).
5. Mở một Pull Request.

---

## 👤 Tác giả

**Trần Minh Khôi**
- Website: [tranminhkhoi.dev](https://tranminhkhoi.dev)
- Email: [contact@tranminhkhoi.dev](mailto:contact@tranminhkhoi.dev)
- GitHub: [@MKTech-CYV](https://github.com/MKTech-CYV)

---

## 📄 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---
*Dự án được tạo ra với sự tập trung vào thẩm mỹ và hiệu suất cho cộng đồng MK Widget Card.*
