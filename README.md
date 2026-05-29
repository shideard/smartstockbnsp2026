# SmartStock Pro - Enterprise Inventory Management

SmartStock Pro adalah sistem manajemen inventaris modern bergaya SaaS (*Software as a Service*) tingkat Enterprise. Proyek ini dibangun untuk memenuhi tugas Post-Assessment sertifikasi BNSP SSMI IPB 2026.

![Dashboard Preview](https://via.placeholder.com/1200x600?text=SmartStock+Pro+Enterprise+Dashboard)

## ✨ Fitur Utama

Aplikasi ini mencakup modul standar BNSP:
1. **Modul 1: Keamanan & Autentikasi**
   - *Role-Based Access Control* (RBAC) untuk Admin, Manajer Gudang, dan Staf.
   - Hashing Password menggunakan `Bcrypt` dengan validasi keamanan ketat.
   - **Audit Logs**: Sistem pelacakan aktivitas transaksi otomatis secara *background* (mencatat Siapa, Kapan, IP Address, dan Deskripsi).
2. **Modul 2: Monitoring Real-Time & Ekspor**
   - Dashboard analitik dengan grafik Chart.js.
   - **Server Resource Monitoring**: Memantau RAM dan Load CPU server secara *live*.
   - **Galeri Produk**: Mendukung unggah gambar (*Image Upload*) lokal menggunakan Multer.
   - Peta Gudang interaktif menggunakan LeafletJS.
   - Export Laporan Dashboard menjadi **PDF** berwarna menggunakan `html2pdf.js`.
3. **Modul 3: Manajemen Data Inventaris**
   - CRUD Entitas: Barang, Kategori, Gudang, Pemasok (Supplier), dan Transaksi (IN/OUT).
   - Fitur **Pencarian (Search)** Data Barang secara *real-time*.
4. **Modul 5: Pemrosesan Paralel**
   - **Transfer Antar Gudang Paralel**: Transaksi (OUT) gudang asal dan (IN) gudang tujuan diproses secara konkuren menggunakan `Promise.all` untuk mencegah *bottleneck* maupun inkonsistensi data.
   - **Batch Import CSV**: Import ribuan data dengan proses eksekusi paralel di Backend.

## 💻 Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS v4, Lucide React, Chart.js, Leaflet, Axios.
- **Backend**: Node.js, Express.js, Sequelize ORM.
- **Database**: MySQL.

---

## 🚀 Instalasi & Konfigurasi

### Prasyarat
- **Node.js** (versi 18+)
- **MySQL Server** (XAMPP / native) jalan di port `3306`

### 1. Kloning Repositori
```bash
git clone https://github.com/shideard/smartstockbnsp2026.git
cd smartstockbnsp2026
```

### 2. Setup Backend & Database
1. Buat database baru di MySQL bernama `smartstock`.
2. Masuk ke folder backend:
   ```bash
   cd backend
   npm install
   ```
3. Buat file `.env` di folder `backend/` dan isi dengan:
   ```env
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=smartstock
   JWT_SECRET=supersecretkey2026
   PORT=5000
   ```
4. Sinkronisasi tabel otomatis dan jalankan server:
   ```bash
   node sync.js
   node server.js
   ```
   *Catatan: `sync.js` akan membuat tabel-tabel (Categories, Items, Transactions, Users, AuditLogs, Suppliers, Warehouses) jika belum ada.*

### 3. Setup Frontend
1. Buka terminal baru, masuk ke folder frontend:
   ```bash
   cd frontend
   npm install
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
3. Akses aplikasi di browser melalui `http://localhost:5173`.

---

## 🔑 Akun Default Tersedia
Anda dapat langsung menggunakan salah satu akun berikut untuk mendemonstrasikan sistem:

| Role | Username | Password | Hak Akses |
| --- | --- | --- | --- |
| **Admin** | `admin` | `password123` | Akses penuh seluruh modul dan master data. |
| **Manajer Gudang** | `manajer` | `password123` | Sama seperti Admin, dapat melihat master data. |
| **Staf Gudang** | `staf` | `password123` | Hanya bisa mengakses Dashboard dan input Transaksi. |
| **Viewer** | `viewer` | `password123` | Akses sangat terbatas (read-only monitoring). |

---

## 🏗️ Struktur Proyek & Arsitektur
- `/backend`: Dibangun dengan **Node.js + Express.js**. Menggunakan pola *Controller-Route-Model*. Semua kueri database difasilitasi oleh **Sequelize ORM** untuk mencegah SQL Injection. 
- `/frontend`: Dibangun dengan **React (Vite)** dan SPA (*Single Page Application*) routing. Konfigurasi desain menggunakan **Tailwind CSS v4** dengan variabel `@theme`.
- **Database**: MySQL relasional.

## 📈 Skalabilitas (Scalability)
Sistem ini dirancang secara *stateless* (menggunakan JWT untuk autentikasi, bukan *session cookie* server). Artinya, backend dapat dengan mudah diperbanyak (*horizontal scaling*) menggunakan *Load Balancer* tanpa merusak sesi pengguna. Selain itu, fitur pemrosesan data berjumlah besar menggunakan *Non-Blocking I/O* dan `Promise.all` secara paralel, sehingga tidak memblokir antrean server.

## 🛡️ Lisensi & Disclaimer
Proyek ini dibuat oleh Deshi Ardiani untuk keperluan uji kompetensi internal IPB **Badan Nasional Sertifikasi Profesi (BNSP) Tahun 2026**.
