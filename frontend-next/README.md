# Frontend - Next.js Application

Aplikasi web modern untuk sistem peminjaman ruang kelas menggunakan Next.js 16, React 19, dan TypeScript.

## 🚀 Instalasi

### 1. Install Dependencies

Menggunakan npm:

```bash
npm install
```

Atau menggunakan yarn:

```bash
yarn install
```

### 2. Jalankan Development Server

Menggunakan npm:

```bash
npm run dev
```

Atau menggunakan yarn:

```bash
yarn dev
```

Aplikasi akan berjalan di: `http://localhost:3000`

## 📁 Struktur Folder

```
app/
├── components/       # Komponen React yang dapat digunakan kembali
│   ├── Navbar.tsx   # Navigasi header
│   ├── Footer.tsx   # Footer aplikasi
│   ├── NotesModal.tsx     # Modal untuk catatan
│   ├── TagsModal.tsx      # Modal untuk tags
│   └── ProtectedRoute.tsx # Route protection
├── contexts/        # React Context API
│   └── AuthContext.tsx    # Authentication context
├── informasi/       # Halaman informasi
├── login/           # Halaman login
├── scraping/        # Halaman scraping
│   └── [id]/       # Dynamic route untuk detail
├── layout.tsx       # Root layout
├── page.tsx         # Home page
└── globals.css      # Global styles
```

## 🎨 Teknologi & Library

- **Next.js 16.1.0** - React Framework
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **@iconify/react** - Icon library
- **XLSX** - Excel file handling

## 📝 Scripts

```bash
npm run dev      # Jalankan development server (port 3000)
npm run build    # Build aplikasi untuk production
npm run start    # Jalankan production build
npm run lint     # Jalankan ESLint
```

## 🔧 Konfigurasi

### Environment Variables

Buat file `.env.local` di root folder frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Next.js Configuration

Edit `next.config.ts` untuk konfigurasi tambahan seperti:

- Image domains
- Environment variables
- Redirects
- Rewrites

## 🌐 Fitur Utama

1. **Authentication System** - Login dan protected routes
2. **Web Scraping Interface** - UI untuk scraping data
3. **Data Management** - Mengelola data peminjaman ruang
4. **Excel Export** - Export data ke format .xlsx
5. **Responsive Design** - Tampilan optimal di berbagai device
6. **Modern UI** - Interface modern dengan Tailwind CSS

## 🔗 API Integration

Aplikasi ini terhubung dengan backend Flask API di `http://localhost:5000`. Pastikan backend server sudah berjalan sebelum menggunakan fitur scraping.

## 📱 Responsive Design

Aplikasi ini dioptimalkan untuk:

- Desktop (1024px ke atas)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

### Port 3000 sudah digunakan

Next.js akan otomatis menawarkan port alternatif (3001, 3002, dst)

### Module not found

```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build error

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
