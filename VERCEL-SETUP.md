# 🔧 Vercel Setup untuk React Router v8 SSR

## 📁 File Structure untuk Deployment

```
portfolio-profesi/
├── api/
│   └── server.js          # ✨ Serverless function handler
├── vercel.json            # ✨ Konfigurasi Vercel
├── app/                   # React Router app
├── build/                 # Build output (auto-generated)
│   ├── client/           # Static assets
│   └── server/           # SSR server bundle
└── package.json
```

## 🎯 Cara Kerja

### 1. `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "rewrites": [{ "source": "/(.*)", "destination": "/api/server" }]
}
```

**Penjelasan:**
- `buildCommand`: Menjalankan build React Router
- `rewrites`: **PENTING!** Semua request diarahkan ke serverless function di `api/server.js`
- Tidak ada `outputDirectory` karena kita butuh server dan client

### 2. `api/server.js`
```javascript
import { createRequestHandler } from "@react-router/node";
import * as build from "../build/server/index.js";

export default createRequestHandler({ build });
```

**Penjelasan:**
- File ini menjadi Vercel Serverless Function
- Menggunakan `createRequestHandler` dari React Router
- Menangani SSR dan routing

### 3. Build Process

```bash
npm run build
```

Menghasilkan:
```
build/
├── client/              # Static assets (CSS, JS, images)
│   ├── assets/
│   └── favicon.ico
└── server/              # Server bundle untuk SSR
    └── index.js
```

## 🚀 Deployment Steps

### Step 1: Push File Baru ke GitHub

```bash
git add vercel.json api/server.js VERCEL-SETUP.md DEPLOYMENT.md
git commit -m "Fix: Add Vercel serverless config for React Router v8 SSR"
git push origin main
```

### Step 2: Redeploy di Vercel

**Option A: Auto Redeploy (Recommended)**
- Vercel otomatis detect push baru dan redeploy
- Tunggu ~2-3 menit

**Option B: Manual Redeploy**
1. Buka Vercel Dashboard
2. Pilih project `portfolio-profesi`
3. Klik "Redeploy" pada deployment terakhir
4. Centang "Use existing Build Cache" → **UNCHECK** (force rebuild)
5. Click "Redeploy"

### Step 3: Update Project Settings (PENTING!)

1. Buka Vercel Dashboard → Project Settings
2. **General**:
   - Build Command: `npm run build` ✅
   - Output Directory: **KOSONGKAN** (hapus `build/client`) ✅
   - Install Command: `npm install` ✅
3. **Environment Variables** (pastikan sudah ada):
   ```
   SUPABASE_URL
   SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   GITHUB_URL
   LINKEDIN_URL
   EMAIL
   NODE_ENV=production
   ```
4. **Save** dan **Redeploy**

## ✅ Testing

Setelah deployment selesai:

1. **Homepage**: `https://your-app.vercel.app/` → harus tampil
2. **About**: `https://your-app.vercel.app/about` → harus tampil
3. **Projects**: `https://your-app.vercel.app/projects` → harus tampil
4. **Reload halaman** → tidak boleh 404 (SSR bekerja)
5. **Direct URL access** → harus langsung load (bukan 404)

## 🐛 Troubleshooting

### Masih 404 setelah deploy?

**Check 1: Vercel Function Logs**
```bash
vercel logs your-deployment-url
```

**Check 2: Build Logs**
1. Vercel Dashboard → Deployments
2. Klik deployment terakhir
3. Check "Build Logs" tab
4. Cari error messages

**Check 3: File Structure**
Pastikan di Vercel deployment:
```
✅ api/server.js ada
✅ build/server/index.js ada
✅ build/client/ ada
✅ vercel.json ada
```

**Check 4: Output Directory Setting**
1. Project Settings → General
2. **Output Directory harus KOSONG**
3. Jika ada isinya, hapus dan redeploy

### Error: Cannot find module

**Solution:**
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run build

# Test local
npm run start

# Jika local work, push ke GitHub
git add .
git commit -m "Fix: Reinstall dependencies"
git push
```

### Build Success tapi Runtime Error

**Check Environment Variables:**
1. Vercel Dashboard → Settings → Environment Variables
2. Pastikan SEMUA variables ada dan benar
3. Redeploy setelah add/edit ENV

## 📊 Expected Build Output

```
✓ Built in 45s
✓ Build artifacts: 2.3 MB
✓ Functions: 1 serverless function created
  - api/server.js (Node.js 18.x)
✓ Static files: 1.8 MB
  - build/client/**
```

## 🎯 Why This Works

### Before (❌ 404 Error):
```
Request → Vercel Static → build/client/index.html (tidak ada)
→ 404 NOT_FOUND
```

### After (✅ Working):
```
Request → Vercel Rewrite → api/server.js (serverless function)
→ React Router SSR → Render halaman → Response HTML
```

## 🔗 Useful Links

- [React Router Docs - Deployment](https://reactrouter.com/en/main/guides/deployment)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel Rewrites](https://vercel.com/docs/projects/project-configuration#rewrites)

---

**🎉 Setelah setup ini, website kamu akan:**
- ✅ Render di server (SSR)
- ✅ Support direct URL access
- ✅ No 404 on page refresh
- ✅ Fast initial page load
- ✅ SEO friendly

**Happy deploying! 🚀**
