PRD (Product Requirements Document)
Project: portfolio-profesi
1. Project Overview
Item	Deskripsi
Nama Project	portfolio-profesi
Tujuan	Membangun website portfolio pribadi profesional dengan halaman publik yang interaktif, dinamis, dan dashboard admin untuk mengelola konten secara real-time tanpa perlu deploy ulang.
Slogan	"Stunning Public View, Powerful Private Control."
Target Audiens	Rekruter HRD, client potensial, dan sesama developer.
2. Tech Stack
Layer	Teknologi	Keterangan
Framework	Remix v7 (React Router v7)	Full-stack framework dengan SSR bawaan
Bahasa	TypeScript (Strict Mode)	Untuk maintainability dan type safety
Styling	Tailwind CSS	Utility-first, ringan, dan mobile-first
Animasi	Tailwind native + motion (lazy load)	Animasi ringan; komponen berat di-lazy load
Database	Supabase (PostgreSQL)	Backend-as-a-service gratis
Auth	Supabase Auth	Email + Password authentication
Storage	Supabase Storage	Untuk upload gambar project
Konten Dinamis	MDX	Untuk deskripsi proyek yang kaya dan terstruktur
Hosting	Vercel (Hobby Plan)	Gratis, integrasi sempurna dengan Remix
Package Manager	npm / pnpm	Terserah preferensi
3. User Roles & Access Control
Role	Akses	Deskripsi
Publik	Semua halaman kecuali /admin/*	Tidak perlu login, bisa melihat portfolio dan mengirim pesan
Admin	Semua halaman termasuk /admin/*	Harus login via email + password untuk mengelola konten
Auth Mechanism:

Menggunakan Supabase Auth dengan Email + Password.

Session Cookie di Remix (app/sessions.ts) untuk menjaga status login.

Setiap request ke route /admin/* akan dicek session-nya di loader. Jika tidak ada session, redirect ke /login.

4. Functional Requirements
A. Halaman Publik (Tanpa Auth)
Route	Fitur	Detail
/ (Homepage)	Hero Section	Animasi teks berganti (typing effect) perkenalan singkat; data diambil dari site_config
Tech Stack Icons	Menampilkan skill dengan animasi hover; data statis di komponen
Featured Projects	Menampilkan 3 project unggulan (is_featured = true) dari Supabase
CTA Button	Tombol ke halaman /projects
/projects	Grid Project Cards	Menampilkan semua project dalam grid; data dari Supabase via loader
Filter Interaktif	Filter berdasarkan kategori (Web, Mobile, UI/UX) - client-side filtering
Detail Project	Klik card → navigasi ke /projects/:slug (halaman detail MDX)
/about	Bio & Profil	Bio singkat, foto profile, dan list pengalaman; data dari site_config
/contact	Form Kontak	Input: Nama, Email, Pesan. Submit via useFetcher ke action; data disimpan ke tabel messages di Supabase. Ada rate limit sederhana di server.
B. Halaman Admin (Wajib Auth)
Semua route di bawah menggunakan prefix /admin.

Route	Fitur	Detail
/admin/login	Halaman Login	Form email + password. Setelah sukses, redirect ke /admin.
/admin (Dashboard)	Statistik	Total Projects, Total Messages (unread)
Recent Messages	List 5 pesan kontak terbaru yang belum dibaca
/admin/projects	Tabel Projects	Daftar semua project dengan tombol Add, Edit, Delete
/admin/projects/new	Form Tambah Project	Input: Title, Slug, Description (MDX Editor), Image Upload, Tech Stack (array), Live URL, Github URL, Is Featured (checkbox)
/admin/projects/:id/edit	Form Edit Project	Sama seperti form tambah, dengan data existing terisi. Ada opsi hapus gambar lama saat upload gambar baru.
/admin/profile	Form Profile	Update konten dinamis: Hero Title, Hero Subtitle, About Bio, Profile Image URL
5. Non-Functional Requirements
Aspek	Target	Strategi
Performance	Lighthouse > 95	Semua data di-fetch di server (loader); HTML sudah berisi konten; gambar pakai loading="lazy"
SEO	Lighthouse > 95	SSR bawaan Remix; meta tags di root.tsx dan per-route
Accessibility	Lighthouse > 90	Semantic HTML; ARIA labels; keyboard navigation
Best Practices	Lighthouse > 90	Environment variables untuk semua kredensial; no console.log di production
Responsive	Mobile-first	Tailwind breakpoints; hamburger menu untuk navbar di mobile
Security	RLS aktif	Supabase Row Level Security: SELECT untuk publik, INSERT/UPDATE/DELETE hanya untuk admin terautentikasi
Scalability	Modular	Struktur folder separation of concerns; services layer untuk business logic
Maintainability	Clean code	TypeScript strict; ESLint + Prettier
6. Database Schema (Supabase)
Tabel: projects
Kolom	Tipe	Keterangan
id	uuid (PK)	Primary key
title	text	Judul project
slug	text (unique)	URL-friendly identifier (contoh: "my-awesome-project")
description	text	Konten MDX untuk deskripsi lengkap
image_url	text	Public URL gambar dari Supabase Storage
tech_stack	text[]	Array teknologi yang digunakan
category	text	Kategori: "Web", "Mobile", "UI/UX"
live_url	text	URL demo live
github_url	text	URL repository GitHub
is_featured	boolean	Flag untuk project unggulan di homepage
created_at	timestamp	Otomatis diisi saat create
updated_at	timestamp	Otomatis diupdate saat edit
Tabel: site_config
Kolom	Tipe	Keterangan
id	uuid (PK)	Primary key
key	text (unique)	Identifier: hero_title, hero_subtitle, about_bio, profile_image
value	text	Nilai konten
Tabel: messages
Kolom	Tipe	Keterangan
id	uuid (PK)	Primary key
name	text	Nama pengirim
email	text	Email pengirim
message	text	Isi pesan
is_read	boolean	Status sudah dibaca admin (default false)
created_at	timestamp	Otomatis diisi saat submit
7. Struktur Folder Remix
text
portfolio-profesi/
├── app/
│   ├── root.tsx                    # Root layout, meta tags, dark mode toggle
│   ├── entry.client.tsx            # Client entry
│   ├── entry.server.tsx            # Server entry
│   │
│   ├── routes/
│   │   ├── _index.tsx              # Homepage (Publik)
│   │   ├── projects.tsx            # Halaman daftar projects (Publik)
│   │   ├── projects._index.tsx     # Fallback untuk /projects
│   │   ├── projects.$slug.mdx      # Halaman detail project (MDX)
│   │   ├── about.tsx               # Halaman About (Publik)
│   │   ├── contact.tsx             # Halaman Contact (Publik)
│   │   ├── login.tsx               # Halaman Login Admin
│   │   │
│   │   └── admin/                  # 🔒 Semua route di sini butuh Auth
│   │       ├── _layout.tsx         # Layout Admin (Sidebar + Navbar)
│   │       ├── _index.tsx          # Dashboard Admin
│   │       ├── projects.tsx        # Daftar & kelola projects
│   │       ├── projects.new.tsx    # Form tambah project
│   │       ├── projects.$id.edit.tsx # Form edit project
│   │       └── profile.tsx         # Edit konten dinamis
│   │
│   ├── components/
│   │   ├── ui/                     # Atom (Button, Input, Card, Badge)
│   │   ├── sections/               # Molekul (Navbar, HeroSection, ProjectCard)
│   │   ├── admin/                  # Komponen khusus admin (Sidebar, Table)
│   │   └── animations/             # Komponen animasi (lazy load)
│   │
│   ├── lib/
│   │   ├── supabase.server.ts      # Init Supabase Client (SERVER SIDE)
│   │   ├── supabase.client.ts      # Init Supabase Client (CLIENT SIDE)
│   │   └── session.ts              # Manage cookie session untuk auth
│   │
│   ├── services/                   # Business Logic
│   │   ├── project.service.ts      # CRUD operations untuk projects
│   │   ├── config.service.ts       # Get/update site_config
│   │   └── message.service.ts      # Send/get messages
│   │
│   ├── models/                     # TypeScript Interfaces
│   │   ├── project.types.ts
│   │   ├── config.types.ts
│   │   └── message.types.ts
│   │
│   └── utils/
│       └── helpers.ts              # Utility functions
│
├── public/
│   └── favicon.ico
│
├── supabase/
│   └── migrations/                 # (Opsional) Migrasi database
│
├── .env.example
├── .gitignore
├── package.json
├── remix.config.js
├── tailwind.config.js
├── tsconfig.json
└── vercel.json                     # Konfigurasi deploy ke Vercel
8. Strategi Animasi
Komponen	Teknik	Keterangan
Hero Section	motion (lazy load)	Typing effect + fade-in; di-lazy-load agar bundle tidak masuk server
Project Cards	Tailwind native	Hover: scale + shadow transition; pure CSS
Scroll Animations	useInView hook + Tailwind	Elemen muncul saat discroll; pakai animate-fade-in dari plugin
Navbar Mobile	Tailwind native	Hamburger menu dengan slide transition; pure CSS
Admin Sidebar	Tailwind native	Expand/collapse dengan transition; pure CSS
9. Environment Variables (.env)
env
# Supabase
SUPABASE_URL=https://zvyriwstsdxofukvrtyu.supabase.co

SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXJpd3N0c2R4b2Z1a3ZydHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTE4NDEsImV4cCI6MjA5Nzg4Nzg0MX0.eNj5BnrwDaby3KNh0--lu4IEG3uoUaUyoOfFlrxLsJo

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXJpd3N0c2R4b2Z1a3ZydHl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjMxMTg0MSwiZXhwIjoyMDk3ODg3ODQxfQ.nOmxFF0oV9-zjkOGN2_QYXPCT2q5w0OLKm245xx0B2g

# Vercel (otomatis terdeteksi)
VERCEL=true
10. Deployment Strategy
Step	Platform	Keterangan
Code Repository	GitHub	Private/Public repo untuk version control
CI/CD	Vercel	Auto-deploy setiap push ke branch main atau develop
Database	Supabase	Terpisah dari Vercel; gunakan connection pooling
Domain	Vercel (.vercel.app) atau custom domain	Custom domain bisa tambahin gratis di Vercel
11. RLS (Row Level Security) Policy - Supabase
sql
-- Table: projects
-- PUBLIC: Bisa SELECT semua project
CREATE POLICY "Public can view projects" ON projects
  FOR SELECT USING (true);

-- AUTHENTICATED: Bisa INSERT, UPDATE, DELETE
CREATE POLICY "Admin can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Table: site_config
-- PUBLIC: Bisa SELECT semua config
CREATE POLICY "Public can view config" ON site_config
  FOR SELECT USING (true);

-- AUTHENTICATED: Bisa UPDATE
CREATE POLICY "Admin can update config" ON site_config
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Table: messages
-- PUBLIC: Bisa INSERT (kirim pesan)
CREATE POLICY "Public can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- AUTHENTICATED: Bisa SELECT dan UPDATE (read/unread)
CREATE POLICY "Admin can manage messages" ON messages
  FOR ALL USING (auth.role() = 'authenticated');


CATATAN PENTING: JANGAN TERLALU TERLIHAT SEPERTI BUATAN AI, BUAT SEOLAH2 KAMU ADALAH WEB DEVELOPER YG SUDAH SENIOR DAN AHLI!!!