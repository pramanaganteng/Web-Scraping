# 🔧 Setup Environment Variables

File `.env` **TIDAK** di-commit ke GitHub untuk keamanan. Anda harus membuat file `.env` sendiri di lokal berdasarkan template `.env.example`.

## ⚠️ Mengapa File .env Tidak Ada di Repository?

File `.env` berisi informasi sensitif seperti:

- Secret keys
- Password database
- API keys
- Kredensial login

Jika di-commit ke GitHub, siapa saja bisa melihat informasi tersebut! Oleh karena itu, `.env` sudah ditambahkan ke `.gitignore`.

## 📝 Cara Setup Environment Variables

### 1. Backend (Python Flask)

```bash
cd scraper-python

# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

**Edit file `.env`** jika perlu mengubah konfigurasi:

```bash
# Windows
notepad .env

# macOS/Linux
nano .env
# atau
code .env
```

**Variabel yang tersedia:**

| Variabel       | Default                 | Deskripsi                   |
| -------------- | ----------------------- | --------------------------- |
| `FLASK_ENV`    | `development`           | Environment Flask           |
| `FLASK_DEBUG`  | `True`                  | Mode debug                  |
| `DATABASE_URL` | `sqlite:///data.db`     | URL database                |
| `PORT`         | `5000`                  | Port backend server         |
| `HOST`         | `0.0.0.0`               | Host backend server         |
| `FRONTEND_URL` | `http://localhost:3000` | URL frontend untuk CORS     |
| `SECRET_KEY`   | `your-secret-key-here`  | ⚠️ **Ganti di production!** |
| `JWT_SECRET`   | `your-jwt-secret-here`  | ⚠️ **Ganti di production!** |

### 2. Frontend (Next.js)

```bash
cd frontend-next

# Windows
copy .env.example .env.local

# macOS/Linux
cp .env.example .env.local
```

**Edit file `.env.local`** jika perlu:

```bash
# Windows
notepad .env.local

# macOS/Linux
nano .env.local
# atau
code .env.local
```

**Variabel yang tersedia:**

| Variabel                  | Default                 | Deskripsi       |
| ------------------------- | ----------------------- | --------------- |
| `NEXT_PUBLIC_API_URL`     | `http://localhost:5000` | URL backend API |
| `NEXT_PUBLIC_APP_NAME`    | `"Web Scraping App"`    | Nama aplikasi   |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0`                 | Versi aplikasi  |

> **💡 Catatan:** Variabel yang diawali `NEXT_PUBLIC_` dapat diakses di browser. Jangan masukkan data sensitif!

## 🔒 Keamanan untuk Production

Saat deploy ke production, **WAJIB** ganti nilai berikut:

### Backend (.env):

```env
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=<generate-random-key-yang-panjang>
JWT_SECRET=<generate-random-key-yang-berbeda>
```

**Generate random key dengan Python:**

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Ganti Password Default:

- Login dengan: `admin` / `admin123`
- Segera ganti password setelah login pertama kali!

## ✅ Checklist Setup

- [ ] Copy `.env.example` menjadi `.env` di folder `scraper-python`
- [ ] Copy `.env.example` menjadi `.env.local` di folder `frontend-next`
- [ ] (Opsional) Edit konfigurasi sesuai kebutuhan
- [ ] Jika production: Ganti `SECRET_KEY` dan `JWT_SECRET`
- [ ] Jika production: Ganti password default admin
- [ ] Pastikan `.env` dan `.env.local` tidak ter-commit ke git

## 🔍 Troubleshooting

### Backend tidak bisa connect ke frontend (CORS error)

✅ Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend Anda

### Frontend tidak bisa connect ke backend

✅ Pastikan `NEXT_PUBLIC_API_URL` di `.env.local` sesuai dengan URL backend Anda

### File .env tidak terbaca

✅ Pastikan nama file benar: `.env` (ada titik di depan)
✅ Restart aplikasi setelah mengubah file .env

## 📚 Referensi

- [Flask Configuration](https://flask.palletsprojects.com/en/2.3.x/config/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Python dotenv](https://pypi.org/project/python-dotenv/)
