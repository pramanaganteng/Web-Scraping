# Panduan Deployment

Dokumen ini berisi panduan untuk deploy aplikasi ke production.

## 📋 Persiapan Sebelum Deploy

### Checklist

- [ ] Semua fitur sudah ditest
- [ ] Tidak ada error atau warning
- [ ] Environment variables sudah dikonfigurasi
- [ ] Database sudah siap
- [ ] Dokumentasi sudah lengkap
- [ ] Backup data sudah dibuat

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + PythonAnywhere (Backend)

#### Deploy Frontend ke Vercel

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login ke Vercel**

```bash
vercel login
```

3. **Deploy dari folder frontend**

```bash
cd frontend-next
vercel
```

4. **Set Environment Variables di Vercel Dashboard**

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

#### Deploy Backend ke PythonAnywhere

1. Daftar di [PythonAnywhere](https://www.pythonanywhere.com/)
2. Upload file Python ke server
3. Setup virtual environment
4. Install dependencies: `pip install -r requirements.txt`
5. Configure WSGI file
6. Reload web app

### Option 2: Deploy ke VPS (Linux Server)

#### Persiapan Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3 python3-pip python3-venv -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Nginx
sudo apt install nginx -y
```

#### Deploy Backend

```bash
# Clone repository
git clone https://github.com/username/scraping-project.git
cd scraping-project/scraper-python

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Test aplikasi
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

#### Deploy Frontend

```bash
cd ../frontend-next

# Install dependencies
npm install

# Build aplikasi
npm run build

# Install PM2 untuk process management
sudo npm install -g pm2

# Start aplikasi
pm2 start npm --name "frontend-next" -- start
pm2 save
pm2 startup
```

#### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/scraping-app
```

Tambahkan konfigurasi:

```nginx
# Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/scraping-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Setup SSL dengan Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

### Option 3: Docker Deployment

#### Dockerfile untuk Backend

```dockerfile
# scraper-python/Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "main:app"]
```

#### Dockerfile untuk Frontend

```dockerfile
# frontend-next/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  backend:
    build: ./scraper-python
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
    volumes:
      - ./data:/app/data

  frontend:
    build: ./frontend-next
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend
```

Jalankan dengan:

```bash
docker-compose up -d
```

## 🔒 Security Checklist untuk Production

- [ ] Ganti semua credentials default
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall (UFW)
- [ ] Disable debug mode
- [ ] Setup rate limiting
- [ ] Enable CORS dengan domain spesifik
- [ ] Backup database secara berkala
- [ ] Setup monitoring dan logging
- [ ] Update dependencies secara rutin
- [ ] Setup automatic security updates

## 📊 Monitoring

### Setup Monitoring Tools

```bash
# Install monitoring tools
sudo apt install htop
sudo npm install -g pm2

# Setup PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
```

### Check Logs

```bash
# Backend logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Frontend logs (PM2)
pm2 logs frontend-next

# Backend logs (Gunicorn)
journalctl -u gunicorn -f
```

## 🔄 Update Aplikasi

```bash
# Pull latest changes
git pull origin main

# Update backend
cd scraper-python
source venv/bin/activate
pip install -r requirements.txt --upgrade
sudo systemctl restart gunicorn

# Update frontend
cd ../frontend-next
npm install
npm run build
pm2 restart frontend-next
```

## 💾 Backup Strategy

### Database Backup

```bash
# Backup database
cp database.db backups/database_$(date +%Y%m%d_%H%M%S).db

# Setup automatic backup (crontab)
0 2 * * * cp /path/to/database.db /path/to/backups/database_$(date +\%Y\%m\%d).db
```

### Full Application Backup

```bash
tar -czf backup_$(date +%Y%m%d).tar.gz \
  scraper-python/ \
  frontend-next/ \
  data/
```

## 🆘 Troubleshooting Production

### Server Not Responding

```bash
# Check services
sudo systemctl status nginx
sudo systemctl status gunicorn
pm2 status

# Restart services
sudo systemctl restart nginx
pm2 restart all
```

### High Memory Usage

```bash
# Check memory
free -h
htop

# Restart services to clear memory
pm2 restart all
```

### Database Issues

```bash
# Check database size
du -h database.db

# Backup and reinitialize
cp database.db database.backup.db
python init_db.py
```

## 📞 Support

Untuk bantuan deployment, silakan:

- Buat issue di GitHub
- Hubungi tim DevOps
- Check dokumentasi cloud provider

---

**Catatan:** Sesuaikan panduan ini dengan kebutuhan dan infrastruktur spesifik Anda.
