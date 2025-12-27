from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import csv
import io
from datetime import datetime
import sqlite3
import os
from dotenv import load_dotenv

# Load environment variables dari file .env
load_dotenv()

from scraper.lsp_scraper import get_lsp_links, scrape_detail
from db import (
    create_scraping,
    save_client,
    get_all_scrapings,
    get_clients_by_scraping,
    update_scraping_name,
    delete_scraping,
    authenticate_user,
    update_scraping_notes,
    update_scraping_tags
)

# Inisialisasi database jika belum ada
def init_database():
    """Inisialisasi database dan tabel jika belum ada"""
    if not os.path.exists("data.db"):
        print("📦 Database belum ada, membuat database baru...")
    
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
    print("✅ Database initialized successfully")

# Panggil fungsi inisialisasi saat aplikasi dimulai
init_database()

app = Flask(__name__)

# Ambil konfigurasi dari environment variables
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SECRET_KEY'] = SECRET_KEY

# Configure CORS - baca dari environment variable
allowed_origins = [FRONTEND_URL]
if FRONTEND_URL != "http://localhost:3000":
    allowed_origins.append("http://localhost:3000")  # Selalu allow localhost untuk development

CORS(app, resources={
    r"/api/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route("/api/scrapings", methods=["GET"])
def list_scrapings():
    try:
        data = get_all_scrapings()
        return jsonify({
            "status": "success",
            "data": data
        })
    except Exception as e:
        print(f"Error fetching scrapings: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route("/api/scrape", methods=["POST"])
def scrape():
    try:
        pages = request.json.get("pages", 1)
        # user_id bisa null untuk sekarang (optional)
        user_id = request.json.get("user_id")
        
        scraping_id = create_scraping(pages=pages, user_id=user_id)

        links = get_lsp_links(pages)

        for link in links:
            data = scrape_detail(link)
            save_client(scraping_id, data)

        return jsonify({
            "status": "success",
            "scraping_id": scraping_id,
            "total": len(links)
        })
    except Exception as e:
        print(f"Error scraping: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route("/api/scrapings/<int:scraping_id>", methods=["GET"])
def scraping_detail(scraping_id):
    return jsonify({
        "status": "success",
        "data": get_clients_by_scraping(scraping_id)
    })

@app.route("/api/scrapings/<int:scraping_id>/rename", methods=["PATCH"])
def rename_scraping(scraping_id):
    name = request.json.get("name")
    update_scraping_name(scraping_id, name)
    return jsonify({"status": "success"})

@app.route("/api/scrapings/<int:scraping_id>", methods=["DELETE"])
def delete_scraping_route(scraping_id):
    delete_scraping(scraping_id)
    return jsonify({"status": "success", "message": "Scraping deleted"})

# ==================== AUTH ROUTES ====================
@app.route("/api/auth/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    
    if not username or not password:
        return jsonify({"status": "error", "message": "Username dan password required"}), 400
    
    user = authenticate_user(username, password)
    
    if user:
        return jsonify({"status": "success", "user": user})
    else:
        return jsonify({"status": "error", "message": "Username atau password salah"}), 401

# ==================== NOTES & TAGS ROUTES ====================
@app.route("/api/scrapings/<int:scraping_id>/notes", methods=["PATCH"])
def update_notes(scraping_id):
    notes = request.json.get("notes", "")
    update_scraping_notes(scraping_id, notes)
    return jsonify({"status": "success"})

@app.route("/api/scrapings/<int:scraping_id>/tags", methods=["PATCH"])
def update_tags(scraping_id):
    tags = request.json.get("tags", [])
    update_scraping_tags(scraping_id, tags)
    return jsonify({"status": "success"})


@app.route("/api/scrapings/download/csv", methods=["GET"])
def download_csv():
    """Download semua scraping sebagai CSV"""
    scrapings = get_all_scrapings()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(["ID", "Nama", "Halaman", "Total Data", "Tanggal Dibuat"])
    
    # Data
    for s in scrapings:
        writer.writerow([
            s['id'],
            s['name'] or f"Scraping #{s['id']}",
            s['pages'],
            s['total_data'],
            s['created_at']
        ])
    
    output.seek(0)
    
    # Create bytes file
    mem = io.BytesIO()
    mem.write(output.getvalue().encode('utf-8'))
    mem.seek(0)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"scraping_list_{timestamp}.csv"
    
    return send_file(
        mem,
        mimetype="text/csv",
        as_attachment=True,
        download_name=filename
    )

@app.route("/api/scrapings/<int:scraping_id>/download/csv", methods=["GET"])
def download_scraping_csv(scraping_id):
    """Download data dari satu scraping sebagai CSV"""
    clients = get_clients_by_scraping(scraping_id)
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(["ID", "Nama", "No Telpon", "No HP", "Email", "Alamat", "Sumber"])
    
    # Data
    for c in clients:
        writer.writerow([
            c['id'],
            c['nama'],
            c['no_telpon'],
            c['no_hp'],
            c['email'],
            c['alamat'],
            c['sumber']
        ])
    
    output.seek(0)
    mem = io.BytesIO()
    mem.write(output.getvalue().encode('utf-8'))
    mem.seek(0)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"scraping_{scraping_id}_{timestamp}.csv"
    
    return send_file(
        mem,
        mimetype="text/csv",
        as_attachment=True,
        download_name=filename
    )

if __name__ == "__main__":
    # Ambil konfigurasi dari environment variables
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"\n🚀 Starting Flask server...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🐛 Debug: {debug}")
    print(f"🌐 CORS allowed origins: {allowed_origins}\n")
    
    app.run(host=host, port=port, debug=debug)
