# Toko Emas [Nama Toko]

MVP cicil emas 24K (Antam/UBS) dengan simulasi murabahah, pengajuan cicilan, dan dashboard admin. Target deploy di Vercel dengan Supabase.

## Fitur MVP
- Simulasi cicilan murabahah (DP, tenor, margin flat).
- Pengajuan cicilan + jadwal cicilan otomatis.
- Admin: CRUD produk, stok, dan settings cicilan.
- Mobile-first UI.

## Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS
- Supabase (Auth, Postgres, Storage)

## Setup Lokal
```bash
npm install
npm run dev
```

## Supabase
1. Buat project Supabase.
2. Jalankan `db/schema.sql` lalu `db/seed.sql`.
3. Buat akun admin di Supabase Auth (Email/Password).
4. Simpan env vars di `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Deploy Vercel
1. Push repo ke GitHub.
2. Import ke Vercel.
3. Set env vars Supabase di Vercel.

## Catatan
- API routes memakai Supabase Service Role untuk operasi admin.
- Jadwal cicilan dibuat saat pengajuan berhasil.
- Denda keterlambatan dihitung via `POST /api/penalty` atau bisa dijalankan terjadwal dengan Vercel Cron.
