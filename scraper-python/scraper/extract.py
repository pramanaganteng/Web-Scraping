import re

def extract_telpon(text):
    """
    Nomor telpon kantor Indonesia
    ❌ tidak boleh diawali 08 (HP)
    Format yang dideteksi:
    - (021) 12345-1234
    - 021-12345-1234
    - 021 12345 1234
    - +62-21-12345-1234
    """
    # Pattern 1: dengan kurung (0xx)
    pattern1 = r"\(0(?!8)\d{1,4}\)\s?[-\s]?\d{3,5}[-\s]?\d{3,5}"
    
    # Pattern 2: tanpa kurung dengan berbagai separator
    pattern2 = r"(?:\+62|0)(?!8)\d{1,4}[-\s]?\d{3,5}[-\s]?\d{3,5}"
    
    # Pattern 3: format (021) 1234-5678 atau similar
    pattern3 = r"\(0(?!8)\d{1,4}\)\s?\d{4,8}"
    
    # Gabungkan semua pattern
    combined_pattern = f"{pattern1}|{pattern2}|{pattern3}"
    results = re.findall(combined_pattern, text)

    # Hapus duplikat
    results = list(dict.fromkeys(results))
    
    # Normalisasi +62 → 0
    cleaned = []
    for r in results:
        if r.startswith("+62"):
            r = "0" + r[3:]
        cleaned.append(r)
    
    cleaned = list(dict.fromkeys(cleaned))

    return " / ".join(cleaned) if cleaned else "-"


def extract_hp(text):
    """
    Nomor HP Indonesia
    Format yang dideteksi:
    - 0812-3456-7890
    - +6281234567890
    - 081 2345 6789
    - 08123456789
    """
    # Pattern untuk 08x dengan berbagai separator
    pattern = r"(?:\+62|0)8[-\s]?\d[-\s]?\d{3,4}[-\s]?\d{3,4}(?:[-\s]?\d{0,4})?|(?:\+62|0)8\d{7,11}"
    results = re.findall(pattern, text)

    # Normalisasi +62 → 0
    cleaned = []
    for r in results:
        # Hapus separator untuk normalisasi
        r_clean = r.replace("-", "").replace(" ", "")
        if r_clean.startswith("+62"):
            r_clean = "0" + r_clean[3:]
        cleaned.append(r_clean)

    cleaned = list(dict.fromkeys(cleaned))

    return " / ".join(cleaned) if cleaned else "-"


def extract_email(text):
    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    match = re.search(pattern, text)
    return match.group(0) if match else "-"
