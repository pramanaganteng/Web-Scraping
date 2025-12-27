import sqlite3

conn = sqlite3.connect("data.db")
cursor = conn.cursor()

# tabel users untuk authentication
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

# tabel scraping (1 scraping = 1 sesi)
cursor.execute("""
CREATE TABLE IF NOT EXISTS scrapings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    pages INTEGER,
    notes TEXT,
    tags TEXT,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
""")

# tabel hasil scraping
cursor.execute("""
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scraping_id INTEGER,
    nama TEXT,
    no_telpon TEXT,
    no_hp TEXT,
    email TEXT,
    alamat TEXT,
    sumber TEXT,
    FOREIGN KEY (scraping_id) REFERENCES scrapings(id)
)
""")

# Insert default user jika belum ada
cursor.execute("SELECT COUNT(*) FROM users")
if cursor.fetchone()[0] == 0:
    # Password: admin (dalam production, gunakan hashing!)
    cursor.execute("""
        INSERT INTO users (username, password)
        VALUES ('admin', 'admin')
    """)
    print("✅ Default user 'admin' created (username: admin, password: admin)")

conn.commit()
conn.close()

print("✅ Database & tabel berhasil dibuat")
