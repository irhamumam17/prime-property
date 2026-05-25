# Plan: Issue #1 — Project Setup & Foundation

**Priority:** P0 — blocker untuk semua issue lain  
**Status saat ini:** Sebagian besar sudah selesai. Hanya 2 task tersisa.

---

## Yang Sudah Selesai (Jangan Diubah)

| Item | Status |
|---|---|
| Semua dependencies (`@supabase/supabase-js`, `jose`, `bcryptjs`, `zod`, `sonner`, `server-only`) | ✅ Terpasang |
| `next.config.ts` — `output: "standalone"` | ✅ |
| `app/globals.css` — Tailwind v4 `@theme` dengan warna brand | ✅ |
| `lib/types.ts` — semua shared TypeScript interfaces | ✅ |
| `lib/format.ts` — `formatPrice`, `formatDate`, `formatDimension`, `formatStatus`, `formatReadiness` | ✅ |

---

## Yang Perlu Dikerjakan

### Task 1 — Update `app/layout.tsx`

File ini masih menggunakan font Geist (default Next.js). Perlu diganti sesuai brand.

**Yang harus diubah:**
- Ganti font dari `Geist` / `Geist_Mono` ke **`Inter`** dari `next/font/google`
- Set `lang="id"` pada tag `<html>`
- Update `metadata`: title `"Prime Property"`, description yang relevan
- Pastikan CSS variable font (`--font-inter`) sesuai dengan yang sudah didefinisikan di `globals.css` (`--font-sans: var(--font-inter)`)

### Task 2 — Buat `.env.example`

Buat file `.env.example` di root project dengan isi berikut (nilai boleh kosong/placeholder):

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SESSION_SECRET=
NEXT_PUBLIC_APP_URL=
RESEND_API_KEY=
ADMIN_EMAIL=
```

---

## Catatan Penting untuk Implementor

- Jangan ubah `globals.css` — sudah benar, termasuk variable `--font-inter`
- Jangan tambah dark mode — light only
- Gunakan `Inter` (bukan `Geist`) agar sesuai dengan design system
- Setelah Task 1 selesai, jalankan `npm run build` untuk memastikan tidak ada error

---

## Definition of Done Issue #1

- [ ] `app/layout.tsx` menggunakan Inter, `lang="id"`, metadata "Prime Property"
- [ ] `.env.example` ada di root dengan semua env vars
- [ ] `npm run build` berhasil tanpa error
