# Issue #3 — Authentication & Route Protection

**Stack:** Next.js 16 App Router · TypeScript · Supabase (PostgreSQL) · `jose` JWT · `bcryptjs`  
**Breaking changes wajib diikuti:** `proxy.ts` (bukan `middleware.ts`), `params`/`searchParams` adalah Promise, `cookies()` adalah async.

---

## Status Existing

Sudah tersedia (tidak perlu dibuat ulang):
- `lib/types.ts` — `User`, `SessionPayload`, `UserRole`, `ActionResult`
- `lib/supabase.ts` — `createServiceClient()`
- `lib/session.ts` — `encrypt()`, `decrypt()`, `createSession()`, `deleteSession()`
- `supabase/migrations/001_init.sql` — tabel `users`, `login_attempts`

---

## Files yang Harus Dibuat

### 1. `lib/dal.ts`
Data Access Layer untuk session. Semua fungsi pakai React `cache()` agar de-duplicate per request.

- `getSession()` — baca cookie `session`, decrypt, kembalikan `SessionPayload | null`
- `verifySession()` — panggil `getSession()`, redirect ke `/agent/login` jika null
- `verifySuperadmin()` — panggil `verifySession()`, return error/throw jika role bukan `superadmin`

### 2. `proxy.ts` (root project)
Route protection — ini pengganti `middleware.ts` di Next.js 16.

- Proteksi semua path `/agent/*` kecuali `/agent/login`
- Jika tidak ada session valid → redirect ke `/agent/login`
- Jika sudah login dan akses `/agent/login` → redirect ke `/agent/properties`
- Config matcher: `['/agent/:path*']`

### 3. `lib/db/users.ts`
Fungsi DB layer untuk tabel `users`. Gunakan `createServiceClient()`.

- `getUserByEmail(email)` — query by email, kembalikan user atau null
- `createUser({ email, name, password, role })` — hash password dengan `bcrypt` cost=10, insert ke DB
- `setUserActive(id, isActive)` — toggle `is_active`
- `updateUserPassword(id, newPasswordHash)` — update `password_hash`

### 4. `lib/db/audit.ts`
- `recordAudit({ userId, entityType, entityId, action, changes })` — insert ke tabel `audit_logs`

### 5. `app/agent/login/page.tsx`
Halaman login client component.

- Form: input Email + Password
- Gunakan `useActionState` (React 19) untuk handle Server Action
- Tampilkan error message dari action result
- Tidak ada signup link — login only

### 6. `app/agent/login/actions.ts`
Server Action `loginAction(prevState, formData)`.

Flow:
1. Validasi input dengan Zod (email format, password min 8 char)
2. Cek lockout: query `login_attempts` — jika ≥5 gagal dalam 30 menit terakhir → return error dengan sisa waktu lockout
3. `getUserByEmail(email)` — jika tidak ada → record attempt gagal, return error generik
4. Cek `is_active` — jika false → return error
5. `bcrypt.compare(password, user.password_hash)` — jika gagal → record attempt, return error
6. Record attempt sukses ke `login_attempts`
7. `createSession({ userId, role, email, name })`
8. `redirect('/agent/properties')`

### 7. `app/api/auth/logout/route.ts`
Route Handler method DELETE (atau GET untuk simplicity).

- Panggil `deleteSession()`
- Redirect ke `/agent/login`

---

## Alur Lockout (AC-5.1)

Query `login_attempts` WHERE `email = $email AND success = false AND attempted_at > NOW() - INTERVAL '30 minutes'`.  
Jika count ≥ 5, hitung sisa waktu dari attempt pertama + 30 menit.

---

## Catatan Implementasi

- Semua file DB layer (`lib/db/`) wajib `import "server-only"` di baris pertama
- Error message login selalu generik ("Email atau password salah") — jangan bedakan "user tidak ada" vs "password salah"
- Backend WAJIB validasi role di setiap Server Action — jangan andalkan frontend hide/show
- Cookie: `httpOnly: true`, `sameSite: 'lax'`, `secure: true` (production), `maxAge: 30 hari`
- `jose` sudah tersedia di project; gunakan fungsi dari `lib/session.ts` yang sudah ada

---

## Urutan Implementasi

1. `lib/db/users.ts` + `lib/db/audit.ts`
2. `lib/dal.ts`
3. `app/agent/login/actions.ts`
4. `app/agent/login/page.tsx`
5. `proxy.ts`
6. `app/api/auth/logout/route.ts`
