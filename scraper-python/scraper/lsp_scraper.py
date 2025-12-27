import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://bnsp.go.id/lsp"
HEADERS = {"User-Agent": "Mozilla/5.0"}

def get_lsp_links(max_pages=1):
    links = []

    for page in range(1, max_pages + 1):
        url = f"{BASE_URL}?hal={page}"
        print("[scraper] ambil:", url)

        r = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(r.text, "html.parser")

        for a in soup.find_all("a", href=True):
            if "/lsp/" in a["href"] and "hal" not in a["href"]:
                links.append(urljoin(BASE_URL, a["href"]))

    return list(set(links))


def scrape_detail(url):
    r = requests.get(url, headers=HEADERS, timeout=15)
    soup = BeautifulSoup(r.text, "html.parser")

    title = soup.select_one("h1, h2.page-title, title")
    nama = title.get_text(strip=True) if title else "-"

    # 🔥 Cari tabel dan ekstrak berdasarkan label
    no_telpon = "-"
    no_hp = "-"
    email = "-"
    alamat = "-"

    # Cari semua rows dalam tabel
    for tr in soup.find_all("tr"):
        cells = tr.find_all("td")
        if len(cells) >= 3:
            label = cells[0].get_text(strip=True).lower()
            value = cells[2].get_text(strip=True)

            if "telp" in label or "telephone" in label:
                if "hp" not in label and "fax" not in label:  # pastikan bukan HP atau Fax
                    no_telpon = value if value else "-"
            elif "hp" in label or "mobile" in label or "ponsel" in label:
                no_hp = value if value else "-"
            elif "email" in label or "e-mail" in label:
                # ekstrak email jika ada link
                email_tag = cells[2].find("a")
                if email_tag and "mailto:" in email_tag.get("href", ""):
                    email = email_tag.get("href", "").replace("mailto:", "").strip()
                else:
                    email = value if value else "-"
            elif "alamat" in label or "address" in label:
                alamat = value if value else "-"

    return {
        "nama": nama,
        "no_telpon": no_telpon,
        "no_hp": no_hp,
        "email": email,
        "alamat": alamat,
        "sumber": url
    }
