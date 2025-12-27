# Web Scraping

Aplikasi web untuk scraping dan manajemen data calon client dengan antarmuka modern menggunakan Next.js dan backend Python Flask.

## 📋 Deskripsi Project

Project ini terdiri dari dua komponen utama:

1. **Frontend (Next.js)** - Antarmuka web modern dengan React dan TypeScript
2. **Backend (Python Flask)** - API server dan web scraper menggunakan BeautifulSoup4

## 🛠️ Teknologi yang Digunakan

### Frontend

- Next.js 16.1.0
- React 19
- TypeScript
- Tailwind CSS
- XLSX (untuk export data)

### Backend

- Python 3.x
- Flask (Web Framework)
- BeautifulSoup4 (Web Scraping)
- SQLite (Database)
- Flask-CORS

## 📦 Persyaratan Sistem

Sebelum memulai instalasi, pastikan sistem Anda sudah memiliki:

- **Node.js** versi 18.x atau lebih baru ([Download di sini](https://nodejs.org/))
- **Python** versi 3.8 atau lebih baru ([Download di sini](https://www.python.org/))
- **Git** ([Download di sini](https://git-scm.com/))
- **npm** atau **yarn** (biasanya sudah terinstall bersama Node.js)

## 🚀 Cara Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/username/scraping-project.git
cd scraping-project
```

### 2. Setup Backend (Python)

#### a. Masuk ke folder backend

```bash
cd scraper-python
```

#### b. Setup Environment Variables

```bash
# Copy file .env.example menjadi .env
copy .env.example .env          # Windows
cp .env.example .env            # macOS/Linux

# Edit file .env sesuai kebutuhan (opsional)
notepad .env                    # Windows
nano .env                       # macOS/Linux
```

#### c. Buat Virtual Environment (Opsional tapi Direkomendasikan)

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

#### d. Install Dependencies

```bash
pip install -r requirements.txt
```

#### e. Inisialisasi Database

```bash
python init_db.py
```

**Kredensial Login Default:**
- Username: `admin`
- Password: `admin123`

> ⚠️ **PENTING:** Ganti password setelah login pertama kali untuk keamanan!

#### f. Jalankan Server Backend

```bash
python main.py
```

Server akan berjalan di `http://localhost:5000`

### 3. Setup Frontend (Next.js)

#### a. Buka terminal baru dan masuk ke folder frontend

```bash
cd frontend-next
```

#### b. Setup Environment Variables

```bash
# Copy file .env.example menjadi .env.local
copy .env.example .env.local    # Windows
cp .env.example .env.local      # macOS/Linux

# File .env.local sudah berisi konfigurasi default:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

> 💡 **Tips:** Untuk production atau akses dari device lain, ganti URL dengan IP server:
> ```
> NEXT_PUBLIC_API_URL=http://192.168.x.x:5000
> ```

#### c. Install Dependencies

Menggunakan npm:

```bash
npm install
```

Atau menggunakan yarn:

```bash
yarn install
```

#### d. Jalankan Development Server

Menggunakan npm:

```bash
npm run dev
```

Atau menggunakan yarn:

```bash
yarn dev
```

Aplikasi akan berjalan di `http://localhost:3000`

> 📝 **Catatan:** Untuk production, jalankan `npm run build` terlebih dahulu, lalu `npm run start`

## 🎯 Cara Menggunakan

1. **Jalankan Backend terlebih dahulu** di `http://localhost:5000`
2. **Jalankan Frontend** di `http://localhost:3000`
3. Buka browser dan akses `http://localhost:3000`
4. **Login menggunakan kredensial default:**
   - Username: `admin`
   - Password: `admin123`
5. Gunakan fitur scraping untuk mengambil data dari sumber
6. Export data ke format Excel jika diperlukan

> ⚠️ **KEAMANAN:** Segera ganti password setelah login pertama kali!

## 📁 Struktur Project

```
scraping-project/
├── frontend-next/          # Aplikasi Next.js
│   ├── app/               # Pages dan routing
│   │   ├── components/    # Komponen React
│   │   ├── contexts/      # Context API (Auth)
│   │   ├── informasi/     # Halaman informasi
│   │   ├── login/         # Halaman login
│   │   └── scraping/      # Halaman scraping
│   ├── public/            # File statis
│   ├── types/             # TypeScript definitions
│   └── package.json       # Dependencies frontend
│
└── scraper-python/         # Backend Flask
    ├── scraper/           # Modul scraping
    │   ├── extract.py     # Fungsi ekstraksi data
    │   └── lsp_scraper.py # Scraper utama
    ├── db.py              # Konfigurasi database
    ├── init_db.py         # Script inisialisasi DB
    ├── main.py            # Entry point Flask
    └── requirements.txt   # Dependencies Python
```

## 🔧 Konfigurasi

### Environment Variables

#### Backend (.env)

Lokasi: `scraper-python/.env`

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# Database
DATABASE_URL=sqlite:///data.db

# Server Configuration
PORT=5000
HOST=0.0.0.0

# CORS Settings
FRONTEND_URL=http://localhost:3000

# Security (GANTI DI PRODUCTION!)
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
```

#### Frontend (.env.local)

Lokasi: `frontend-next/.env.local`

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000

# Untuk production atau akses dari device lain:
# NEXT_PUBLIC_API_URL=http://192.168.x.x:5000
```

### Backend Configuration

Edit file `scraper-python/main.py` untuk mengubah:

- Port server (default: 5000)
- CORS settings
- Database path

### Frontend Configuration

Edit file `frontend-next/next.config.ts` untuk konfigurasi Next.js

## 📝 Scripts yang Tersedia

### Frontend

```bash
npm run dev      # Jalankan development server
npm run build    # Build untuk production
npm run start    # Jalankan production server
npm run lint     # Jalankan linter
```

### Backend

```bash
python main.py        # Jalankan Flask server
python init_db.py     # Inisialisasi database
python migrate_db.py  # Migrasi database (jika ada perubahan skema)
```

## 🐛 Troubleshooting

### Port sudah digunakan

**Backend:**

- Jika port 5000 sudah digunakan, ubah port di `main.py`

**Frontend:**

- Jika port 3000 sudah digunakan, Next.js akan otomatis menawarkan port lain

### Modul tidak ditemukan (Python)

```bash
# Pastikan virtual environment aktif
pip install -r requirements.txt --upgrade
```

### Dependency error (Node.js)

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### Database error

```bash
# Reinisialisasi database
cd scraper-python
python init_db.py
```

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Project ini dibuat untuk keperluan Hak Kekayaan Intelektual (HKI).

## 👥 Tim Pengembang

[Tambahkan informasi tim pengembang di sini]

## 📞 Kontak

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Catatan:** Pastikan kedua server (backend dan frontend) berjalan bersamaan untuk penggunaan aplikasi yang optimal.
