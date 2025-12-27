# Panduan Kontribusi

Terima kasih atas minat Anda untuk berkontribusi pada project ini! Dokumen ini berisi panduan untuk berkontribusi.

## 🚀 Cara Berkontribusi

### 1. Fork Repository

Klik tombol "Fork" di bagian kanan atas halaman repository

### 2. Clone Fork Anda

```bash
git clone https://github.com/username-anda/scraping-project.git
cd scraping-project
```

### 3. Buat Branch Baru

```bash
git checkout -b feature/nama-fitur-anda
```

Penamaan branch:

- `feature/` - untuk fitur baru
- `bugfix/` - untuk perbaikan bug
- `docs/` - untuk perubahan dokumentasi
- `refactor/` - untuk refactoring code

### 4. Lakukan Perubahan

- Tulis code yang bersih dan mudah dibaca
- Ikuti style guide yang ada
- Tambahkan komentar jika diperlukan
- Test perubahan Anda

### 5. Commit Perubahan

```bash
git add .
git commit -m "feat: deskripsi singkat perubahan"
```

Format commit message:

- `feat:` - fitur baru
- `fix:` - perbaikan bug
- `docs:` - perubahan dokumentasi
- `style:` - perubahan formatting
- `refactor:` - refactoring code
- `test:` - menambah/memperbaiki test
- `chore:` - maintenance

### 6. Push ke Fork Anda

```bash
git push origin feature/nama-fitur-anda
```

### 7. Buat Pull Request

- Buka repository fork Anda di GitHub
- Klik "New Pull Request"
- Pilih branch yang ingin di-merge
- Isi deskripsi perubahan dengan detail
- Submit Pull Request

## 📋 Checklist Sebelum Submit PR

- [ ] Code sudah ditest dan berjalan dengan baik
- [ ] Tidak ada error atau warning
- [ ] Dokumentasi sudah diupdate (jika perlu)
- [ ] Code mengikuti style guide project
- [ ] Commit message mengikuti konvensi
- [ ] Branch sudah up-to-date dengan main

## 🎨 Style Guide

### Python

- Ikuti PEP 8
- Gunakan snake_case untuk variable dan function
- Maksimal 79 karakter per line
- Tambahkan docstring untuk function

### TypeScript/React

- Gunakan camelCase untuk variable dan function
- Gunakan PascalCase untuk component
- Gunakan TypeScript types/interfaces
- Ikuti ESLint rules

### Git Commit

```
<type>: <deskripsi singkat>

<deskripsi detail (opsional)>

<footer (opsional)>
```

## 🐛 Melaporkan Bug

Jika menemukan bug, buat issue dengan informasi:

1. Deskripsi bug
2. Langkah-langkah untuk reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (jika ada)
6. Environment (OS, browser, versi)

## 💡 Mengusulkan Fitur

Untuk mengusulkan fitur baru:

1. Buat issue dengan label "enhancement"
2. Jelaskan fitur yang diusulkan
3. Jelaskan use case/keuntungan fitur
4. Sertakan mockup/diagram (jika ada)

## 📝 Code Review Process

1. Maintainer akan review PR Anda
2. Mungkin ada request untuk perubahan
3. Lakukan perubahan yang diminta
4. PR akan di-merge setelah approved

## 🤝 Code of Conduct

- Bersikap profesional dan menghormati
- Berikan feedback yang konstruktif
- Fokus pada improvement project
- Bantu sesama kontributor

## 📞 Pertanyaan?

Jika ada pertanyaan, silakan:

- Buat issue dengan label "question"
- Hubungi maintainer

Terima kasih telah berkontribusi! 🎉
