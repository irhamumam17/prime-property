# Prime Property — Project Issues

Stack: **Next.js 16.2.6 (App Router)** · **Tailwind CSS v4** · **Supabase (PostgreSQL)** · **TypeScript**  
Auth: Custom JWT (jose) + httpOnly cookies — bukan Supabase Auth  
Naming convention: **English** untuk semua nama file, variabel, fungsi, komponen, tipe

> ⚠️ Next.js 16 breaking changes wajib diperhatikan:
> - `middleware.ts` → **`proxy.ts`** (renamed, middleware deprecated)
> - `params` & `searchParams` kini **Promise** — harus `await`
> - `cookies()` kini **async** — harus `await cookies()`
> - Global helper types: `PageProps`, `LayoutProps`, `RouteContext` (no import needed)

---

## Issue #1 — Project Setup & Foundation

**Priority:** P0 (blocker untuk semua issue lain)  
**Depends on:** —

Setup fondasi project sebelum implementasi fitur apapun.

**Tasks:**
- Install dependencies: `@supabase/supabase-js`, `jose`, `bcryptjs`, `@types/bcryptjs`, `zod`, `sonner`, `server-only`
- Update `next.config.ts`: tambah `output: "standalone"` (wajib untuk Docker build)
- Update `app/globals.css`: ganti dengan Tailwind v4 `@theme` tokens — warna brand `#1A1A1A`, `#C9A961`, `#B33A3A`, `#F5F5F5`
- Update `app/layout.tsx`: Inter font, `lang="id"`, metadata "Prime Property"
- Buat `lib/types.ts`: semua shared TypeScript interfaces (`User`, `Property`, `SessionPayload`, `PropertyFilters`, `PaginatedProperties`, `ActionResult`, dll.)
- Buat `lib/format.ts`: `formatPrice()` (Rupiah locale ID), `formatDate()` (Jakarta TZ), `formatDimension()`, `formatStatus()`, `formatReadiness()`
- Buat `.env.example` dengan semua required env vars

**Required env vars:**
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SESSION_SECRET=        # 32-char random string: openssl rand -base64 32
NEXT_PUBLIC_APP_URL=   # https://prime-pro.irhamu.dev
RESEND_API_KEY=        # untuk Supabase Edge Function
ADMIN_EMAIL=           # penerima notif contact form
```

**Reference:** AC-1.1, AC-1.2

---

## Issue #2 — Supabase Database Schema & Migrations

**Priority:** P0  
**Depends on:** Issue #1

Setup database schema di Supabase dan seed data dummy.

**Tasks:**
- Buat `supabase/migrations/001_init.sql` dengan tabel:
  - `users` — id, email, password_hash, name, role (admin|superadmin), is_active, created_at
  - `login_attempts` — id, email, attempted_at, success (untuk lockout logic)
  - `properties` — semua field sesuai AC-6.1 (nama_property, group_name, lebar, panjang, hadap text[], tipe, tingkat, price bigint, carport, status, siap, maps_link, kawasan text[], unit, timestamps, created_by FK, deleted_at)
  - `audit_logs` — id, user_id FK, entity_type, entity_id, action, changes jsonb, created_at
  - `contact_submissions` — id, ip_address, submitted_at (untuk rate limiting)
- Buat `supabase/seed.sql`: 1 superadmin + 1 admin account + minimal 50 properti dummy dengan variasi kawasan/tipe/status
- Apply migrations ke Supabase project via dashboard atau CLI

**Note:**
- Kolom DB tetap pakai nama Indonesian snake_case sesuai AC spec
- TypeScript types pakai English camelCase (mapping dilakukan di layer DB)
- `group` adalah reserved word SQL — gunakan `group_name` di DB, map ke `group` di TypeScript
- `price` disimpan sebagai `bigint` (integer rupiah penuh, bukan float)
- `hadap` dan `kawasan` disimpan sebagai PostgreSQL `text[]` array

**Reference:** AC-6.1, AC-10.1

---

## Issue #3 — Authentication & Route Protection

**Priority:** P1  
**Depends on:** Issue #1, #2

Sistem login untuk agent internal dengan role-based access.

**Tasks:**
- Buat `lib/supabase.ts`: server-only Supabase service client factory (`createServiceClient()`)
- Buat `lib/session.ts`: JWT encrypt/decrypt dengan `jose`, `createSession()`, `deleteSession()` — httpOnly cookie, SameSite=Lax, 30 hari
- Buat `lib/dal.ts`: `getSession()`, `verifySession()`, `verifySuperadmin()` — semua pakai React `cache()` untuk de-duplicate per request
- Buat `proxy.ts` di root (bukan `middleware.ts`!): proteksi semua route `/agent/*` kecuali `/agent/login`
- Buat `lib/db/users.ts`: fungsi DB untuk user management (getUser by email, createUser, updateUser status, resetPassword)
- Buat `lib/db/audit.ts`: fungsi `recordAudit()` untuk catat setiap perubahan
- Buat `app/agent/login/page.tsx`: form email + password, pakai `useActionState` (React 19)
- Buat `app/agent/login/actions.ts`: Server Action login — validasi, cek lockout, bcrypt compare, createSession, redirect

**Lockout logic (AC-5.1):**
- Cek tabel `login_attempts`: jika ≥5 gagal dalam 30 menit → reject dengan sisa lockout time
- Record setiap attempt ke `login_attempts`

**Logout (AC-5.3):**
- Buat `app/api/auth/logout/route.ts`: DELETE session cookie → redirect ke `/agent/login`

**Authorization:**
- Backend WAJIB validasi role di setiap Server Action dan Route Handler
- Admin yang akses endpoint mutasi → return 403 Forbidden
- Frontend hanya hide/show UI elements berdasarkan role

**Reference:** AC-5.1, AC-5.2, AC-5.3

---

## Issue #4 — Public Pages (Landing, About, Contact)

**Priority:** P1  
**Depends on:** Issue #1, #2

Tiga halaman publik yang accessible tanpa login.

**Struktur route:**
```
app/(public)/
  layout.tsx          ← sticky header + footer
  page.tsx            ← Landing (/)
  about/page.tsx      ← About Us (/about)
  contact/page.tsx    ← Contact Us (/contact)
```

**Tasks:**

### Landing Page (AC-2)
- Hero section: background `#1A1A1A`, tagline Prime Property, 1 CTA button emas → link ke listing publik atau contact
- Featured Properties: ambil 6 properti dari Supabase (status=in_stock, tidak di-filter) — server component, read-only, tampil sebagai cards tabular
- "Why Prime Property": 4 value proposition dengan ikon dan deskripsi
- Footer: logo, kontak (telp/WA/email), link About & Contact

### Sticky Header (AC-2.3)
- Order menu: Logo | Beranda | Tentang Kami | Kontak | "Login Agent" (outline gold button, kanan)
- Logo Prime Property wajib tampil
- Sticky di semua halaman publik

### About Us (AC-3)
- Layout 2 kolom desktop (teks + quote/visual), 1 kolom mobile
- Konten statis: profil perusahaan, visi misi, nilai (tulis placeholder konten yang relevan)

### Contact Us (AC-4)
- Info kontak: alamat, telepon, email, link WhatsApp
- Form: Nama, Email, Nomor HP, Pesan — validasi client-side + server-side (Zod)
- Rate limit: max 3 submit per IP per jam (simpan ke tabel `contact_submissions`)
- Submit → kirim email via Supabase Edge Function (lihat Issue #8)
- Success toast: "Pesan terkirim, tim kami akan menghubungi Anda."

**Design requirements:**
- Font: Inter
- Responsive: mobile (≤640px), tablet (≤1024px), desktop (≥1024px)
- Spacing grid: 4/8/16/24/32px
- Tidak ada dark mode — light only

**Reference:** AC-2, AC-3, AC-4

---

## Issue #5 — Internal Dashboard: Property Listing & Filter

**Priority:** P2  
**Depends on:** Issue #3

Dashboard view untuk Admin dan Superadmin melihat + mencari properti.

**Struktur route:**
```
app/agent/(dashboard)/
  layout.tsx                     ← dashboard shell + auth guard
  properties/page.tsx            ← listing table
  properties/[id]/page.tsx       ← detail properti
```

**Tasks:**
- Buat `lib/db/properties.ts`: fungsi `getProperties(filters)` dengan query Supabase — support filter, sort, pagination, soft-delete filter (`deleted_at IS NULL`)
- Buat `app/agent/(dashboard)/layout.tsx`: sidebar/topbar dashboard, ambil user dari session
- Buat `components/dashboard/dashboard-header.tsx`: user info + dropdown logout
- Buat property listing page: server component, baca `searchParams` (await! Next.js 16), query DB, render table

### Property Table (AC-7.1)
- Kolom: Nama, Group, Lebar × Panjang, Hadap, Tipe, Tingkat, Harga, Carport, Status, Siap, Kawasan
- Pagination: 25/50/100 per halaman, default 50
- Sort: nama, harga asc/desc, tanggal dibuat, status
- Status badge berwarna: In Stock (hijau), Sold Out (merah `#B33A3A`), Siap Huni (emas), Siap Kosong (ungu)
- Klik baris → buka halaman detail

### Filter Panel (AC-7.2)
- Filter: Kawasan (multi-select), Lebar min, Hadap (multi-select), Harga max, Tipe (radio), Status (radio), Siap (multi-select), Carport (toggle)
- Search bar: free-text → cari ke nama + group + kawasan
- Filter state disimpan di URL query params (shareable)
- Apply real-time dengan debounce 300ms (client component)
- Active filters tampil sebagai chips, bisa di-remove individual
- Tombol "Reset Filter"

### Property Detail (AC-7.3)
- Layout 2 kolom, semua field properti
- Tombol "Buka di Google Maps" jika `mapsUrl` ada
- Superadmin: tampil tombol "Edit" dan "Hapus"
- Admin: tombol Edit/Hapus tidak tampil

**Reference:** AC-7.1, AC-7.2, AC-7.3

---

## Issue #6 — Internal Dashboard: Property CRUD (Superadmin Only)

**Priority:** P2  
**Depends on:** Issue #5

Full CRUD properti hanya untuk role Superadmin.

**Struktur route:**
```
app/agent/(dashboard)/
  properties/new/page.tsx         ← create form
  properties/[id]/edit/page.tsx   ← edit form
  properties/actions.ts           ← Server Actions (create, update, delete)
```

**Authorization:** Setiap Server Action wajib panggil `verifySuperadmin()` — return error jika bukan superadmin, bukan hanya hide UI.

**Tasks:**

### Create Property (AC-8.1)
- Tombol "+ Add Property" hanya render untuk superadmin
- Form 2-kolom, semua field dari AC-6.1
- Validasi: Zod schema — nama min 3/max 100 char, lebar/panjang > 0 max 2 desimal, price integer > 0, tingkat 1-10 max 1 desimal, maps_link harus URL dengan domain google.com/maps
- Error inline di bawah field, warna `#B33A3A`
- Submit sukses → toast + redirect ke listing dengan entry baru di-highlight
- Optional: tombol "Save & Add Another"

### Update Property (AC-8.2)
- Form sama dengan create, pre-filled dengan data existing
- Dirty state indicator (field yang berubah)
- Batal → kembali ke detail tanpa save
- Setiap save → catat ke `audit_logs` (who, when, what fields changed)

### Delete Property (AC-8.3)
- Konfirmasi modal: "Are you sure you want to delete [name]? This action cannot be undone."
- Implementasi: **soft delete** — set `deleted_at = NOW()`, bukan hard delete
- Properti terhapus tidak muncul di listing manapun (filter `deleted_at IS NULL`)

**Reference:** AC-8.1, AC-8.2, AC-8.3, AC-8.4

---

## Issue #7 — User Management (Superadmin Only)

**Priority:** P2  
**Depends on:** Issue #3

Superadmin dapat kelola akun admin.

**Struktur route:**
```
app/agent/(dashboard)/
  users/page.tsx      ← list + manage admins
  users/actions.ts    ← Server Actions
```

**Tasks:**
- List semua admin accounts dengan status (active/inactive)
- Create admin: form nama, email, password (hashed dengan bcrypt cost=10)
- Disable/enable admin: toggle `is_active`
- Reset password admin: generate new password, tampilkan sekali ke superadmin
- Semua aksi harus verify superadmin role di server side

**Reference:** AC-5.2

---

## Issue #8 — Email Notification (Supabase Edge Function + Resend)

**Priority:** P2  
**Depends on:** Issue #4

Kirim email notifikasi saat form kontak di-submit.

**Tasks:**
- Buat `supabase/functions/send-contact-email/index.ts`: Deno edge function
  - Receive: `{ name, email, phone, message }` dari Next.js API
  - Call Resend API untuk kirim email ke `ADMIN_EMAIL`
  - Return success/error JSON
- Setup Resend API key sebagai Supabase secret: `supabase secrets set RESEND_API_KEY=...`
- Di `app/api/contact/route.ts` Next.js: setelah validasi dan rate limit, invoke edge function via `supabase.functions.invoke('send-contact-email', { body: data })`
- Deploy edge function: `supabase functions deploy send-contact-email`

**Email template (simple):**
```
Subject: [Prime Property] Pesan baru dari {name}
Body: Nama: {name}, Email: {email}, HP: {phone}, Pesan: {message}
```

**Reference:** AC-4.2

---

## Issue #9 — UI Component Library

**Priority:** P1 (parallel dengan Issue #4, #5)  
**Depends on:** Issue #1

Buat reusable UI components sesuai design system.

**Components yang dibutuhkan:**

| Component | Lokasi | Keterangan |
|---|---|---|
| `Button` | `components/ui/button.tsx` | Variants: gold-filled, gold-outline, danger, ghost |
| `Badge` | `components/ui/badge.tsx` | Variants: in-stock, sold-out, siap-huni, siap-kosong, siap-renovasi |
| `Input` | `components/ui/input.tsx` | Text, number, dengan error state |
| `Select` | `components/ui/select.tsx` | Single dan multi-select |
| `Modal` | `components/ui/modal.tsx` | Konfirmasi dialog |
| `ToastProvider` | `components/ui/toast-provider.tsx` | Wrapper sonner Toaster |
| `Pagination` | `components/dashboard/pagination.tsx` | Page navigation dengan URL params |

**Design tokens (Tailwind classes):**
- Primary: `bg-primary text-white`
- Gold filled: `bg-gold text-primary`
- Gold outline: `border border-gold text-gold`
- Danger: `bg-accent-red text-white`

**Reference:** AC-1.1, AC-1.2

---

## Issue #10 — CI/CD: GitHub Actions → Docker Hub → k3s

**Priority:** P3  
**Depends on:** Semua issue sebelumnya

Automated deployment pipeline.

**Files yang perlu dibuat:**

### Dockerfile
```
Multi-stage build:
  Stage 1 (builder): node:22-alpine, npm ci, npm run build
  Stage 2 (runner): node:22-alpine, copy .next/standalone, EXPOSE 3000, CMD ["node", "server.js"]
```
Requires `output: "standalone"` di `next.config.ts` (sudah di-set di Issue #1).

### Kubernetes Manifests (`k8s/`)
- `deployment.yaml`: 1 replica, image dari Docker Hub, env dari Secret, readiness/liveness probe ke `/api/health`
- `service.yaml`: ClusterIP, port 3000
- `ingress.yaml`: host `prime-pro.irhamu.dev`, TLS (cert-manager atau manual)
- `configmap.yaml`: non-secret env vars

### GitHub Actions (`.github/workflows/deploy.yaml`)
Trigger: push ke `main` branch

Steps:
1. Checkout + setup Node.js
2. `npm ci && npm run lint && npm run build` (validate sebelum deploy)
3. Docker build → tag dengan `${{ github.sha }}`
4. Docker push ke Docker Hub (pakai secrets `DOCKERHUB_USERNAME` + `DOCKERHUB_TOKEN`)
5. `kubectl set image` pakai KUBECONFIG dari GitHub secret
6. `kubectl rollout status` sampai deployment sukses

### GitHub Secrets yang wajib dikonfigurasi:
```
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
KUBECONFIG              # base64-encoded kubeconfig k3s
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SESSION_SECRET
NEXT_PUBLIC_APP_URL
ADMIN_EMAIL
```

### Health Check endpoint
- Buat `app/api/health/route.ts`: return `{ status: "ok", timestamp }` — dipakai oleh k8s probe

**Reference:** AC-9.1, AC-9.2

---

## Issue #11 — Non-Functional: Performance, Security, i18n

**Priority:** P3  
**Depends on:** Issue #4, #5, #6

Polish sebelum production.

**Security (AC-9.2):**
- Semua internal endpoint punya authentication middleware (sudah via proxy.ts)
- Rate limiting: 100 req/min/IP global, 10 req/min/IP untuk auth endpoint
- Input sanitization — Zod sudah handle, tambahkan escape untuk output yang render HTML
- HTTPS-only — handle di Ingress/k3s level, `secure: true` di cookie sudah di-set

**Performance (AC-9.1):**
- FCP < 1.5s — pastikan halaman publik adalah Server Components, minimal JS di client
- Filter/search response < 500ms — tambah Supabase index pada kolom filter: `status`, `kawasan`, `tipe`, `deleted_at`
- Lighthouse ≥ 85 untuk landing page

**Localization (AC-9.3):**
- Semua teks UI dalam Bahasa Indonesia
- Format harga: `Rp 1.350.000.000` (Intl.NumberFormat locale `id-ID`)
- Format tanggal: `24 Mei 2026` (timezone `Asia/Jakarta`)

**Browser Support (AC-9.4):**
- Chrome/Edge/Firefox/Safari 2 tahun terakhir
- Mobile Safari iOS 14+, Chrome Android

---

## Issue #12 — Superadmin Documentation

**Priority:** P3  
**Depends on:** Issue #5, #6, #7

**Task:**
- Buat `docs/superadmin-guide.md`: panduan singkat cara manage properti dan user
- Topik: login, tambah properti, edit properti, hapus (dan bahwa itu soft delete), manage admin accounts
- Format: markdown, bisa langsung di-render di GitHub

**Reference:** AC-10.1 (Definition of Done, poin 7)

---

## Definition of Done (AC-10.1)

Fitur dinyatakan **DONE** jika:
1. Semua acceptance criteria terpenuhi dan teruji
2. Tidak ada bug priority High/Critical
3. UI sesuai brand guidelines (palette warna, typography, logo)
4. Responsive di mobile, tablet, desktop
5. Backend authorization terverifikasi (admin tidak bisa CRUD)
6. Filter dan search berjalan dengan ≥50 properti dummy
7. Dokumentasi superadmin tersedia
