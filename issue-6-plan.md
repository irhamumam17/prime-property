# Issue #6 — Property CRUD (Superadmin Only)

**Stack:** Next.js 16 App Router · Supabase · TypeScript  
**Depends on:** Issue #5 (dashboard + property listing sudah ada)  
**Branch:** `feature/issue-6-property-crud`

---

## Context

Dashboard property listing sudah jalan (Issue #5). Detail page sudah punya tombol **Edit** dan **Hapus** untuk superadmin, tapi route-nya belum ada. Issue ini mengimplementasikan semua route & logic tersebut.

Pola yang wajib diikuti:
- Authorization: `await verifySuperadmin()` dari `lib/dal.ts` — wajib di setiap Server Action
- DB layer: tambah fungsi di `lib/db/properties.ts` (ikuti pola `getPropertyById`)
- Audit: panggil `recordAudit()` dari `lib/db/audit.ts` setiap ada perubahan
- Return type Server Action: gunakan `ActionResult<T>` dari `lib/types.ts`
- Params Next.js 16: `await params`, `await searchParams` — jangan lupa

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `app/agent/(dashboard)/properties/new/page.tsx` | CREATE — form tambah properti |
| `app/agent/(dashboard)/properties/[id]/edit/page.tsx` | CREATE — form edit properti |
| `app/agent/(dashboard)/properties/actions.ts` | CREATE — Server Actions: create, update, delete |
| `lib/db/properties.ts` | UPDATE — tambah `createProperty`, `updateProperty`, `softDeleteProperty` |

---

## Phase 1 — Server Actions (`properties/actions.ts`)

Buat 3 Server Actions. Semua wajib:
1. Panggil `verifySuperadmin()` di baris pertama
2. Validasi input dengan Zod
3. Panggil fungsi DB yang sesuai
4. Panggil `recordAudit()` dengan `entityType: "property"`
5. Return `ActionResult`

### `createProperty(formData)`
- Validasi: nama min 3 char, lebar/panjang > 0, price integer > 0, maps_link harus URL google.com/maps (jika diisi)
- Insert ke Supabase, set `created_by` dari session
- On success: redirect ke `/agent/properties?highlight={newId}`

### `updateProperty(id, formData)`
- Ambil data lama dulu untuk mencatat diff di audit log
- Update field yang berubah saja
- On success: redirect ke `/agent/properties/{id}`

### `deleteProperty(id)`
- Soft delete: `set deleted_at = NOW()` — **bukan** hard delete
- On success: redirect ke `/agent/properties`

---

## Phase 2 — DB Layer (`lib/db/properties.ts`)

Tambah 3 fungsi baru, ikuti pola `getPropertyById`:

```ts
createProperty(data: PropertyFormData, createdBy: string): Promise<Property>
updateProperty(id: string, data: Partial<PropertyFormData>): Promise<Property>
softDeleteProperty(id: string): Promise<void>
```

Mapping field: gunakan `mapDbPropertyToProperty` yang sudah ada untuk output. Input form (camelCase TypeScript) → DB columns (Indonesian snake_case).

---

## Phase 3 — Create Form (`properties/new/page.tsx`)

- Server Component, panggil `verifySuperadmin()` — redirect otomatis jika bukan superadmin
- Form 2-kolom (desktop), 1-kolom (mobile)
- Gunakan `useActionState` (React 19) untuk handle submit + error state
- Field sesuai tipe `Property`: nama, group, lebar, panjang, hadap (multi-select), tipe (radio), tingkat, harga, carport (toggle), status (radio), siap (select), kawasan (multi-select), unit, maps_link
- Error inline di bawah field, warna `#B33A3A`
- Tombol: "Simpan" + "Batal" (kembali ke listing)

---

## Phase 4 — Edit Form (`properties/[id]/edit/page.tsx`)

- Sama dengan Create Form, tapi pre-filled dengan data dari `getPropertyById(id)`
- Jika properti tidak ditemukan → `notFound()`
- Tombol: "Simpan Perubahan" + "Batal" (kembali ke detail)

---

## Phase 5 — Hapus (wiring detail page)

Detail page (`properties/[id]/page.tsx`) sudah punya tombol Hapus yang submit ke `/api/properties/delete`. **Ganti** implementasi ini agar memanggil Server Action `deleteProperty` langsung via form action — lebih idiomatis Next.js App Router, tidak perlu Route Handler terpisah.

---

## Validation Zod Schema (referensi)

```ts
const propertySchema = z.object({
  name: z.string().min(3).max(100),
  group: z.string().optional(),
  width: z.number().positive().multipleOf(0.01),
  length: z.number().positive().multipleOf(0.01),
  facing: z.array(z.enum(["Utara","Selatan","Timur","Barat"])).min(1),
  type: z.enum(["Ruko","Villa"]),
  floors: z.number().min(1).max(10).multipleOf(0.1),
  price: z.number().int().positive(),
  carport: z.boolean(),
  status: z.enum(["in_stock","sold_out"]),
  readiness: z.enum(["siap_huni","siap_kosong","siap_huni_renovasi"]),
  area: z.array(z.string()).min(1),
  unit: z.string().optional(),
  mapsUrl: z.string().url().refine(u => u.includes("google.com/maps")).optional().or(z.literal("")),
})
```

---

## Acceptance Criteria

- [ ] Superadmin bisa create properti baru — muncul di listing
- [ ] Superadmin bisa edit properti — perubahan tersimpan
- [ ] Superadmin bisa hapus properti — tidak muncul di listing (soft delete)
- [ ] Admin (bukan superadmin) yang akses route `/new` atau `/edit` → redirect atau error
- [ ] Setiap create/update/delete tercatat di tabel `audit_logs`
- [ ] Validasi form menampilkan error inline, bukan alert browser
