import sqlite3

print("🔄 Memulai migrasi database...")

conn = sqlite3.connect("data.db")
cursor = conn.cursor()

# Cek apakah kolom notes sudah ada
cursor.execute("PRAGMA table_info(scrapings)")
columns = [col[1] for col in cursor.fetchall()]

# Tambahkan kolom notes jika belum ada
if 'notes' not in columns:
    print("➕ Menambahkan kolom 'notes'...")
    cursor.execute("ALTER TABLE scrapings ADD COLUMN notes TEXT")
    print("✅ Kolom 'notes' berhasil ditambahkan")
else:
    print("ℹ️  Kolom 'notes' sudah ada")

# Tambahkan kolom tags jika belum ada
if 'tags' not in columns:
    print("➕ Menambahkan kolom 'tags'...")
    cursor.execute("ALTER TABLE scrapings ADD COLUMN tags TEXT")
    print("✅ Kolom 'tags' berhasil ditambahkan")
else:
    print("ℹ️  Kolom 'tags' sudah ada")

# Tambahkan kolom user_id jika belum ada
if 'user_id' not in columns:
    print("➕ Menambahkan kolom 'user_id'...")
    cursor.execute("ALTER TABLE scrapings ADD COLUMN user_id INTEGER")
    print("✅ Kolom 'user_id' berhasil ditambahkan")
else:
    print("ℹ️  Kolom 'user_id' sudah ada")

# Buat tabel users jika belum ada
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP)
""")
print("✅ Tabel 'users' siap")

# Insert default user jika belum ada
cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'admin'")
if cursor.fetchone()[0] == 0:
    cursor.execute("""
        INSERT INTO users (username, password)
        VALUES ('admin', 'admin')
    """)
    print("✅ Default user 'admin' dibuat (username: admin, password: admin)")
else:
    print("ℹ️  User 'admin' sudah ada")

conn.commit()
conn.close()

print("\n✅ Migrasi database selesai!")
print("📊 Data lama tetap aman")
