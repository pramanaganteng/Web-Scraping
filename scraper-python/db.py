import sqlite3

DB_NAME = "data.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def create_scraping(name=None, pages=1, user_id=None):
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        INSERT INTO scrapings (name, pages, notes, tags, user_id)
        VALUES (?, ?, ?, ?, ?)
    """, (
        name,
        pages,
        None,  # notes default null
        None,  # tags default null
        user_id  # user_id bisa null untuk backward compatibility
    ))

    scraping_id = cur.lastrowid
    db.commit()
    db.close()

    return scraping_id


def save_client(scraping_id, data):
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        INSERT INTO clients (
            scraping_id,
            nama,
            no_telpon,
            no_hp,
            email,
            alamat,
            sumber
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        scraping_id,
        data.get("nama", "-"),
        data.get("no_telpon", "-"),
        data.get("no_hp", "-"),
        data.get("email", "-"),
        data.get("alamat", "-"),
        data.get("sumber", "-")
    ))

    db.commit()
    db.close()

def get_all_scrapings():
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        SELECT 
            s.id,
            s.name,
            s.pages,
            s.notes,
            s.tags,
            s.created_at,
            COUNT(c.id) as total_data
        FROM scrapings s
        LEFT JOIN clients c ON c.scraping_id = s.id
        GROUP BY s.id
        ORDER BY s.created_at DESC
    """)

    rows = cur.fetchall()
    db.close()

    return [dict(row) for row in rows]

def get_clients_by_scraping(scraping_id):
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        SELECT 
            id,
            nama,
            no_telpon,
            no_hp,
            email,
            alamat,
            sumber
        FROM clients
        WHERE scraping_id = ?
    """, (scraping_id,))

    rows = cur.fetchall()
    db.close()

    return [dict(row) for row in rows]

def update_scraping_name(scraping_id, name):
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        UPDATE scrapings
        SET name = ?
        WHERE id = ?
    """, (name, scraping_id))

    db.commit()
    db.close()


def delete_scraping(scraping_id):
    """Hapus scraping dan semua clients yang terkait"""
    db = get_db()
    cur = db.cursor()

    # Hapus clients terlebih dahulu
    cur.execute("DELETE FROM clients WHERE scraping_id = ?", (scraping_id,))
    
    # Hapus scraping
    cur.execute("DELETE FROM scrapings WHERE id = ?", (scraping_id,))

    db.commit()
    db.close()


# ==================== AUTH FUNCTIONS ====================
def authenticate_user(username, password):
    """Verify user credentials"""
    db = get_db()
    cur = db.cursor()
    
    cur.execute("""
        SELECT id, username
        FROM users
        WHERE username = ? AND password = ?
    """, (username, password))
    
    user = cur.fetchone()
    db.close()
    
    return dict(user) if user else None


# ==================== NOTES & TAGS FUNCTIONS ====================
def update_scraping_notes(scraping_id, notes):
    """Update notes untuk scraping"""
    db = get_db()
    cur = db.cursor()
    
    cur.execute("""
        UPDATE scrapings
        SET notes = ?
        WHERE id = ?
    """, (notes, scraping_id))
    
    db.commit()
    db.close()


def update_scraping_tags(scraping_id, tags):
    """Update tags untuk scraping (tags disimpan sebagai comma-separated string)"""
    db = get_db()
    cur = db.cursor()
    
    # Convert list to comma-separated string
    tags_str = ','.join(tags) if isinstance(tags, list) else tags
    
    cur.execute("""
        UPDATE scrapings
        SET tags = ?
        WHERE id = ?
    """, (tags_str, scraping_id))
    
    db.commit()
    db.close()



