# Backend - Web Scraper Python

Backend API server menggunakan Flask untuk web scraping dan manajemen data peminjaman ruang kelas.

## 🔧 Instalasi

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Inisialisasi Database

```bash
python init_db.py
```

## 🚀 Menjalankan Server

```bash
python main.py
```

Server akan berjalan di: `http://localhost:5000`

## 📚 API Endpoints

### Health Check

```
GET /
Response: "Scraper API is running"
```

### Scraping Operations

```
POST /scrape
Body: {
  "url": "target_url",
  "params": {...}
}
```

## 🗃️ Database

Project ini menggunakan SQLite dengan struktur tabel yang didefinisikan di `db.py`.

### Migrasi Database

Jika ada perubahan skema database, jalankan:

```bash
python migrate_db.py
```

## 📦 Dependencies

- **Flask**: Web framework
- **Requests**: HTTP library untuk scraping
- **BeautifulSoup4**: HTML parsing
- **Flask-CORS**: Cross-Origin Resource Sharing

## 🔒 Keamanan

- Pastikan menambahkan validasi input sebelum production
- Gunakan environment variables untuk konfigurasi sensitif
- Enable HTTPS untuk production deployment
