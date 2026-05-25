# Plan: Issue #2 — Supabase Database Schema & Migrations

**Priority:** P0  
**Depends on:** Issue #1 (project setup selesai)  
**Complexity:** Small–Medium

---

## Goal

Setup database schema di Supabase dan isi dengan seed data dummy agar fitur-fitur selanjutnya (auth, listing, CRUD) bisa dibangun di atasnya.

---

## Files to Create

| File | Action | Keterangan |
|---|---|---|
| `supabase/migrations/001_init.sql` | CREATE | DDL semua tabel |
| `supabase/seed.sql` | CREATE | Data dummy untuk development |

---

## Task 1 — Buat Migration File (`001_init.sql`)

Buat 5 tabel berikut dalam satu file migrasi:

### `users`
- `id` UUID PRIMARY KEY default gen_random_uuid()
- `email` TEXT UNIQUE NOT NULL
- `password_hash` TEXT NOT NULL
- `name` TEXT NOT NULL
- `role` TEXT NOT NULL CHECK (role IN ('admin', 'superadmin'))
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### `login_attempts`
- `id` UUID PRIMARY KEY default gen_random_uuid()
- `email` TEXT NOT NULL
- `attempted_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `success` BOOLEAN NOT NULL

### `properties`
- `id` UUID PRIMARY KEY default gen_random_uuid()
- `nama_property` TEXT NOT NULL
- `group_name` TEXT  ← bukan `group` (reserved SQL word)
- `lebar` NUMERIC(10,2) NOT NULL
- `panjang` NUMERIC(10,2) NOT NULL
- `hadap` TEXT[] NOT NULL DEFAULT '{}'  ← PostgreSQL array
- `tipe` TEXT NOT NULL CHECK (tipe IN ('Ruko', 'Villa'))
- `tingkat` NUMERIC(4,1) NOT NULL
- `price` BIGINT NOT NULL  ← integer rupiah penuh, bukan float
- `carport` BOOLEAN NOT NULL DEFAULT false
- `status` TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'sold_out'))
- `siap` TEXT NOT NULL CHECK (siap IN ('siap_huni', 'siap_kosong', 'siap_huni_renovasi'))
- `maps_link` TEXT
- `kawasan` TEXT[] NOT NULL DEFAULT '{}'  ← PostgreSQL array
- `unit` TEXT
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `created_by` UUID NOT NULL REFERENCES users(id)
- `deleted_at` TIMESTAMPTZ  ← soft delete

### `audit_logs`
- `id` UUID PRIMARY KEY default gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES users(id)
- `entity_type` TEXT NOT NULL
- `entity_id` UUID NOT NULL
- `action` TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete'))
- `changes` JSONB NOT NULL DEFAULT '{}'
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### `contact_submissions`
- `id` UUID PRIMARY KEY default gen_random_uuid()
- `ip_address` TEXT NOT NULL
- `submitted_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Indexes (wajib untuk performa filter)
```sql
CREATE INDEX ON properties(status);
CREATE INDEX ON properties(tipe);
CREATE INDEX ON properties(deleted_at);
CREATE INDEX ON properties USING GIN(kawasan);
CREATE INDEX ON login_attempts(email, attempted_at);
```

---

## Task 2 — Buat Seed File (`seed.sql`)

Isi file dengan:

1. **1 superadmin account**
   - email: `superadmin@primeproperty.id`
   - password_hash: bcrypt hash dari password `SuperAdmin123!` (cost=10)
   - role: `superadmin`

2. **1 admin account**
   - email: `admin@primeproperty.id`
   - password_hash: bcrypt hash dari password `Admin123!` (cost=10)
   - role: `admin`

3. **Minimal 50 properti dummy** dengan variasi:
   - kawasan: minimal 5 kawasan berbeda (e.g., BSD, Alam Sutera, Serpong, Tangerang, Gading Serpong)
   - tipe: campuran Ruko & Villa
   - status: campuran in_stock & sold_out
   - siap: campuran semua 3 nilai
   - harga: rentang realistis Rp 500.000.000 - Rp 10.000.000.000
   - hadap: variasi Utara/Selatan/Timur/Barat (bisa lebih dari 1)

---

## Task 3 — Apply ke Supabase

Pilih salah satu cara:

**Via Supabase Dashboard:**
- Buka project di supabase.com → SQL Editor
- Copy-paste isi `001_init.sql` → Run
- Copy-paste isi `seed.sql` → Run

**Via Supabase CLI (jika sudah setup):**
```bash
supabase db push
supabase db seed
```

---

## Constraints & Notes

- Kolom DB pakai **Indonesian snake_case** (sesuai AC spec), bukan English
- TypeScript types di `lib/types.ts` sudah ada — mapping TS-DB dilakukan di layer query (Issue #3+)
- `group_name` di DB → map ke `group` di TypeScript
- `price` harus `BIGINT`, bukan DECIMAL/FLOAT
- `hadap` dan `kawasan` harus `TEXT[]` (PostgreSQL native array), bukan JSON string
- Tidak perlu Row Level Security (RLS) — auth dilakukan via custom JWT di aplikasi
- Tidak perlu Supabase Auth triggers

---

## Acceptance Criteria

- [ ] Semua 5 tabel terbuat tanpa error
- [ ] Indexes terbuat
- [ ] Seed berhasil: 2 users + >= 50 properties ter-insert
- [ ] Query sederhana `SELECT * FROM properties LIMIT 5` berhasil dari SQL Editor
