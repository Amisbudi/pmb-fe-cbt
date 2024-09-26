# Deployment Front-End dengan Docker CBT Front-End (React Vite)

Panduan ini akan membantu Anda untuk melakukan deployment aplikasi front-end React yang dibangun dengan Vite menggunakan Docker. Proses deployment ini dikelola melalui Docker Compose, jadi pastikan file `docker-compose.yml` dan `Dockerfile` sudah dikonfigurasi dengan benar.

## Prasyarat

- Docker terpasang di mesin Anda.
- Docker Compose terpasang.
- File `Dockerfile` dan `docker-compose.yml` telah disiapkan dengan benar.

## Langkah-langkah Deployment

### 1. Sesuaikan Port

Pastikan konfigurasi port di `docker-compose.yml` sudah benar. Secara default, Vite berjalan di port `4200`, namun Anda dapat menyesuaikan port yang akan digunakan.

### 2. Membangun dan Menjalankan Kontainer Docker

Setelah port dikonfigurasi di `docker-compose.yml`, Anda dapat membangun dan menjalankan kontainer Docker dengan perintah berikut:

```bash
docker-compose up -d
```

Flag -d digunakan untuk menjalankan kontainer dalam mode detached, yang berarti kontainer akan berjalan di latar belakang.

### 3. Mengakses Aplikasi

Setelah kontainer berjalan, aplikasi React Anda dapat diakses melalui port yang telah ditentukan di file `docker-compose.yml`.

Sebagai contoh, jika Anda memetakan port `4200`, buka browser dan akses alamat berikut:

```bash
http://localhost:4200
```

### 4. Menghentikan Aplikasi

Untuk menghentikan kontainer yang berjalan, gunakan perintah berikut:

```bash
docker-compose down
```

Perintah ini akan menghentikan dan menghapus kontainer yang dibuat oleh Docker Compose.