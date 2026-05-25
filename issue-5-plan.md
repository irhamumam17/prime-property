# Issue #5 — Internal Dashboard: Property Listing & Filter

## Context

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · Supabase · TypeScript  
**Auth:** Custom JWT via `lib/dal.ts` — gunakan `verifySession()` di server components  
**Existing foundation:**
- `lib/db/properties.ts` → `getProperties(filters)` sudah ada dan lengkap
- `lib/types.ts` → `Property`, `PropertyFilters`, `PaginatedProperties` sudah terdefinisi
- `lib/dal.ts` → `verifySession()`, `verifySuperadmin()` sudah ada
- `components/ui/` → `Button`, `Badge`, `Input` sudah ada; `Select`, `Modal`, `Pagination` belum

---

## Route Structure

```
app/agent/(dashboard)/
  layout.tsx                        ← dashboard shell (sidebar + topbar)
  properties/page.tsx               ← listing table (Server Component)
  properties/[id]/page.tsx          ← detail properti (Server Component)
```

> **Next.js 16 Note:** `params` dan `searchParams` harus di-`await` karena bertipe Promise.

---

## Phase 1 — Missing UI Components

Buat 3 komponen yang belum ada:

| Komponen | Lokasi | Keterangan |
|---|---|---|
| `Select` | `components/ui/select.tsx` | Single & multi-select dengan controlled state |
| `Pagination` | `components/dashboard/pagination.tsx` | Navigation halaman via URL params (bukan state) |
| `FilterPanel` | `components/dashboard/filter-panel.tsx` | Client Component — semua filter dengan debounce 300ms |

---

## Phase 2 — Dashboard Layout

Buat `app/agent/(dashboard)/layout.tsx`:
- Panggil `verifySession()` di awal — redirect ke `/agent/login` jika tidak terautentikasi
- Layout: sidebar navigasi kiri + konten kanan (atau topbar — pilih salah satu, konsisten)
- Topbar/header: tampilkan `session.name`, `session.role`, tombol Logout
- Logout tombol → `DELETE /api/auth/logout` (sudah ada)

---

## Phase 3 — Property Listing Page

`app/agent/(dashboard)/properties/page.tsx` — **Server Component**

1. `await searchParams` untuk ambil filter dari URL
2. Parse params menjadi `PropertyFilters` object
3. Panggil `getProperties(filters)` dari `lib/db/properties.ts`
4. Render tabel + `FilterPanel` + `Pagination`

**Tabel kolom (AC-7.1):**
Nama · Group · Lebar × Panjang · Hadap · Tipe · Tingkat · Harga · Carport · Status · Siap · Kawasan

**Tampilan status badge** (gunakan komponen `Badge` yang sudah ada):
- `in_stock` → hijau
- `sold_out` → merah (`#B33A3A`)
- `siap_huni` → emas
- `siap_kosong` → ungu

**Klik baris** → navigasi ke `/agent/properties/[id]`

**Pagination:** 25/50/100 per halaman, default 50 — simpan di URL param `perPage`

**Sort:** via URL param `sortBy` — opsi: `name`, `price_asc`, `price_desc`, `created_at`, `status`

---

## Phase 4 — Filter Panel (Client Component)

`components/dashboard/filter-panel.tsx` — **Client Component**

- Baca initial state dari URL params (di-pass sebagai props dari Server Component parent)
- Update URL params via `router.push` / `useSearchParams` + `useRouter`
- Debounce 300ms untuk search bar dan input numerik
- Filter yang tersedia: Kawasan (multi-select), Lebar min, Hadap (multi-select), Harga max, Tipe (radio), Status (radio), Siap (multi-select), Carport (toggle)
- Active filters tampil sebagai chips — bisa di-remove individual
- Tombol "Reset Filter" — clear semua params

---

## Phase 5 — Property Detail Page

`app/agent/(dashboard)/properties/[id]/page.tsx` — **Server Component**

1. `await params` untuk ambil `id`
2. Query single property dari Supabase (`getPropertyById` — buat di `lib/db/properties.ts`)
3. Tampil semua field dalam layout 2 kolom
4. Tombol "Buka di Google Maps" jika `mapsUrl` tidak null
5. **Role-based UI:** Superadmin → tampil tombol Edit & Hapus; Admin → tombol tidak tampil (cukup kondisional di frontend, validasi backend ada di Issue #6)

---

## Data Flow Summary

```
URL params (searchParams)
  → Server Component parses filters
    → getProperties(filters) [lib/db/properties.ts]
      → Supabase query
        → render tabel + pagination

User interacts with FilterPanel (Client Component)
  → update URL params (router.push)
    → Next.js re-renders Server Component with new searchParams
```

---

## Files to Create / Modify

| File | Action |
|---|---|
| `components/ui/select.tsx` | CREATE |
| `components/dashboard/pagination.tsx` | CREATE |
| `components/dashboard/filter-panel.tsx` | CREATE |
| `components/dashboard/dashboard-header.tsx` | CREATE |
| `app/agent/(dashboard)/layout.tsx` | CREATE |
| `app/agent/(dashboard)/properties/page.tsx` | CREATE |
| `app/agent/(dashboard)/properties/[id]/page.tsx` | CREATE |
| `lib/db/properties.ts` | MODIFY — tambah `getPropertyById(id)` |

---

## Constraints & Notes

- **Semua teks UI dalam Bahasa Indonesia**
- Format harga: `formatPrice()` dari `lib/format.ts` — output `Rp 1.350.000.000`
- Filter state di URL (bukan React state) agar shareable dan survives refresh
- Tidak ada dark mode — light only
- Responsive: mobile, tablet, desktop
- Jangan pakai library form/table external — pakai HTML semantik + Tailwind
