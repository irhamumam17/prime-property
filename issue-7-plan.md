# Issue #7 — User Management (Superadmin Only)

**Stack:** Next.js 16 App Router · Supabase · TypeScript  
**Depends on:** Issue #3 (auth + `lib/db/users.ts` sudah ada)  
**Branch:** `feature/issue-7-user-management`

---

## Context

Sistem auth sudah jalan (Issue #3). `lib/db/users.ts` sudah punya fungsi: `getUserByEmail`, `createUser`, `setUserActive`, `updateUserPassword`. Issue ini menambah UI dan Server Actions untuk superadmin manage akun admin lewat dashboard.

Pola yang wajib diikuti:
- Authorization: `await verifySuperadmin()` dari `lib/dal.ts` — wajib di setiap Server Action
- DB layer: tambah `getAllUsers()` di `lib/db/users.ts` (ikuti pola yang sudah ada)
- Audit: panggil `recordAudit()` dari `lib/db/audit.ts` setiap ada perubahan
- Return type Server Action: gunakan `ActionResult<T>` dari `lib/types.ts`
- Params Next.js 16: `await params`, `await searchParams` — jangan lupa

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `app/agent/(dashboard)/users/page.tsx` | CREATE — list semua admin accounts |
| `app/agent/(dashboard)/users/new/page.tsx` | CREATE — form tambah admin |
| `app/agent/(dashboard)/users/actions.ts` | CREATE — Server Actions: create, toggle active, reset password |
| `lib/db/users.ts` | UPDATE — tambah `getAllUsers()` |

---

## Phase 1 — DB Layer (`lib/db/users.ts`)

Tambah 1 fungsi baru:

```ts
getAllUsers(): Promise<User[]>
```

Query semua user dari tabel `users`, urutkan by `created_at` DESC. Jangan filter by role — tampilkan semua (admin + superadmin).

---

## Phase 2 — Server Actions (`users/actions.ts`)

Buat 3 Server Actions. Semua wajib panggil `verifySuperadmin()` di baris pertama.

### `createAdmin(formData)`
- Validasi: nama min 2 char, email valid, password min 8 char
- Cek email belum terdaftar (duplicate check)
- Hash password dengan bcrypt cost=10 (gunakan `createUser()` yang sudah ada)
- On success: redirect ke `/agent/users`
- Audit: action `"create"`, entityType `"user"`

### `toggleUserActive(userId, currentStatus)`
- Toggle `is_active` (gunakan `setUserActive()` yang sudah ada)
- Superadmin tidak bisa disable dirinya sendiri — cek `userId !== session.userId`
- On success: revalidate page (atau redirect ke `/agent/users`)
- Audit: action `"update"`, catat `is_active` old→new

### `resetUserPassword(userId)`
- Generate password baru: random 12 karakter (alphanumeric)
- Hash dan simpan via `updateUserPassword()` yang sudah ada
- Return password baru dalam `ActionResult.data` — tampilkan sekali ke superadmin
- Audit: action `"update"`, changes: `{ password: "reset" }` (jangan log password asli)

---

## Phase 3 — User List Page (`users/page.tsx`)

- Server Component, panggil `verifySuperadmin()` — redirect otomatis jika bukan superadmin
- Fetch semua users via `getAllUsers()`
- Tampilan tabel dengan kolom: Nama, Email, Role, Status, Tanggal Dibuat, Aksi

### Kolom Aksi (per row):
- **Toggle Active/Inactive:** form action → `toggleUserActive`. Tampil sebagai button "Nonaktifkan" (merah) atau "Aktifkan" (hijau). Disable jika row adalah user sendiri
- **Reset Password:** button → `resetUserPassword`. Tampilkan hasil (password baru) via inline state atau modal
- Tombol **"+ Tambah Admin"** di header halaman

### Status badge:
- Aktif: warna hijau
- Nonaktif: warna merah `#B33A3A`

---

## Phase 4 — Create Admin Form (`users/new/page.tsx`)

- Client Component dengan `useActionState` (React 19)
- Field: Nama, Email, Password
- Error inline di bawah field, warna `#B33A3A`
- Tombol: "Simpan" + "Batal" (kembali ke `/agent/users`)

---

## Acceptance Criteria

- [ ] Superadmin bisa melihat semua akun admin
- [ ] Superadmin bisa membuat akun admin baru
- [ ] Superadmin bisa disable/enable akun admin
- [ ] Superadmin tidak bisa disable akunnya sendiri
- [ ] Superadmin bisa reset password admin — password baru ditampilkan sekali
- [ ] Admin (bukan superadmin) yang akses route `/agent/users` → redirect atau error
- [ ] Setiap create/toggle/reset tercatat di tabel `audit_logs`
