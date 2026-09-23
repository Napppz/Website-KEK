# KEK Indonesia Information & Investment Portal

Portal resmi informasi terpadu dan peluang investasi Kawasan Ekonomi Khusus (KEK) Republik Indonesia. Dibangun dengan standar kelembagaan modern, performa tinggi, aksesibel, dan arsitektur modular yang scalable.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan custom institutional government tokens
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI Primitives, accessible & unstyled foundation)
- **Database**: [PostgreSQL (Neon Serverless)](https://neon.tech/)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Auth.js / NextAuth.js](https://authjs.dev/) (Credentials Provider & JWT Strategy)
- **Validation**: [Zod](https://zod.dev/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & `@hookform/resolvers`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Quality**: ESLint, Prettier

---

## 📁 Struktur Direktori

```text
src/
├── app/
│   ├── (public)/                 # Rute publik portal KEK
│   │   ├── layout.tsx            # Header publik & Footer kelembagaan
│   │   ├── page.tsx              # Beranda utama
│   │   ├── tentang-kek/          # Profil & landasan hukum Dewan Nasional KEK
│   │   ├── kek-indonesia/        # Direktori & peta persebaran kawasan
│   │   ├── investasi/            # Insentif fiskal & kemudahan berusaha
│   │   ├── berita/               # Kabar terkini & siaran pers
│   │   ├── jdih/                 # Jaringan dokumentasi & informasi hukum
│   │   ├── laporan/              # Publikasi laporan tahunan kinerja
│   │   ├── galeri/               # Dokumentasi foto & video fasilitas
│   │   └── kontak/               # Formulir bantuan & helpdesk investasi
│   │
│   ├── admin/                    # Portal manajemen administrator
│   │   ├── layout.tsx            # Admin layout dengan sidebar navigasi
│   │   ├── page.tsx              # Ringkasan dashboard
│   │   ├── kek/                  # Manajemen data kawasan KEK
│   │   ├── berita/               # Manajemen publikasi berita & artikel
│   │   ├── dokumen/              # Manajemen regulasi JDIH
│   │   ├── laporan/              # Manajemen berkas laporan
│   │   ├── galeri/               # Manajemen galeri foto kawasan
│   │   └── users/                # Manajemen peran dan akun pengguna
│   │
│   ├── api/                      # REST API Endpoint
│   │   ├── auth/[...nextauth]/   # Auth.js route handler
│   │   ├── kek/                  # GET /api/kek
│   │   ├── berita/               # GET /api/berita
│   │   ├── dokumen/              # GET /api/dokumen
│   │   └── laporan/              # GET /api/laporan
│   │
│   ├── layout.tsx                # Root layout (Metadata SEO, Fonts)
│   └── globals.css               # Design system tokens & utility styling
│
├── components/
│   ├── ui/                       # Reusable UI components (Button, Card, Badge, Dialog, Dropdown, Breadcrumb, Input)
│   ├── layout/                   # Header, Footer
│   ├── home/                     # Komponen spesifik beranda
│   ├── kek/                      # Komponen direktori kawasan & filter
│   ├── berita/                   # Komponen daftar berita & pembaca artikel
│   ├── dokumen/                  # Komponen tabel regulasi JDIH
│   ├── map/                      # Modul GIS peta persebaran KEK
│   └── admin/                    # Komponen tabel & widget panel admin
│
├── lib/
│   ├── prisma.ts                 # Singleton Prisma client instance
│   ├── auth.ts                   # Konfigurasi Auth.js
│   ├── utils.ts                  # Class merger (cn) & localized formatters
│   └── validations/              # Skema validasi Zod (auth, kek, news, document, dll)
│
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema (8 model relasional)
│   └── seed.ts                   # Data development realistis KEK Indonesia
│
├── types/                        # Definisi TypeScript kustom
└── public/
    ├── images/                   # Aset gambar publik
    └── icons/                    # Aset ikon & logo
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Kloning dan Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka `.env` dan masukkan kredensial Neon PostgreSQL Anda:
```env
# Neon Connection String (Pooled)
DATABASE_URL="postgresql://[user]:[password]@[neon_host]/[dbname]?sslmode=require"

# Direct URL untuk migrasi Prisma
DIRECT_URL="postgresql://[user]:[password]@[neon_host_direct]/[dbname]?sslmode=require"

# Secret autentikasi
AUTH_SECRET="your-random-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Eksekusi Migrasi Database (Neon PostgreSQL)
Jalankan migrasi untuk membuat tabel pada database Neon Anda:
```bash
npx prisma migrate dev --name init_kek_portal
```
*Atau untuk sinkronisasi skema langsung saat development:*
```bash
npm run db:push
```

### 5. Seeding Data Awal (Development)
Isi database dengan data realistis kawasan KEK, kategori, berita, dokumen hukum, laporan tahunan, dan data investasi:
```bash
npm run db:seed
```

> **Akun Default Development (Seed Data):**
> - **Administrator**: `admin@kek.go.id` | Kata Sandi: `AdminKEK2026!`
> - **Editor Publikasi**: `redaksi@kek.go.id` | Kata Sandi: `EditorKEK2026!`

### 6. Menjalankan Server Development
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).
Portal admin dapat diakses di [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 📋 Database Schema & Relasi Model

Skema Prisma mengelola 8 model terstruktur:
1. **`User`**: Akun pengelola sistem dengan role `ADMIN` dan `EDITOR`.
2. **`KEK`**: Entitas Kawasan Ekonomi Khusus (nama, slug, provinsi, luas area, fokus industri, status beroperasi/tahap pembangunan, koordinat GIS, gambar).
3. **`NewsCategory`**: Kategori siaran pers dan berita kawasan.
4. **`News`**: Artikel dan siaran pers terpublikasi dengan relasi ke penulis (`User`), kategori (`NewsCategory`), dan kawasan terkait (`KEK`).
5. **`Document`**: Basis data regulasi JDIH (Undang-Undang, PP, Perpres, Permenkeu) dengan nomor ketetapan dan tahun.
6. **`Report`**: Laporan kinerja tahunan dan audit realisasi investasi berkala.
7. **`Gallery`**: Dokumentasi visual fasilitas kawasan, infrastruktur, dan kegiatan operasional.
8. **`Investment`**: Data historis realisasi investasi (Rupiah) dan penyerapan tenaga kerja per kawasan per tahun.

---

## 🔍 Pemeriksaan Kualitas & Build

- **Typecheck**: `npm run typecheck`
- **Lint**: `npm run lint`
- **Build**: `npm run build`
