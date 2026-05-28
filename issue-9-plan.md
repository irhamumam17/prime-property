# Issue #9 — UI Component Library

**Priority:** P1  
**Depends on:** Issue #1 (design tokens sudah ada di globals.css)  
**Branch:** `feature/issue-9-ui-components`

---

## Status Existing Components

Sebagian besar komponen sudah dibuat di issue-issue sebelumnya. Audit hasilnya:

| Component | File | Status | Catatan |
|---|---|---|---|
| `Button` | `components/ui/button.tsx` | ✅ Done | Semua 4 variant ada |
| `Badge` | `components/ui/badge.tsx` | ⚠️ Perlu fix | Variant `siap-renovasi` → namanya `siap-huni-renovasi`, sesuaikan dengan spec |
| `Input` | `components/ui/input.tsx` | ✅ Done | Ada error state |
| `Select` | `components/ui/select.tsx` | ✅ Done | Single + multi via native `<select>` |
| `ToastProvider` | `components/ui/toast-provider.tsx` | ✅ Done | Wrapper sonner |
| `Pagination` | `components/dashboard/pagination.tsx` | ✅ Done | URL params |
| `Modal` | `components/ui/modal.tsx` | ❌ Belum ada | **Harus dibuat** |

---

## Yang Harus Dikerjakan

### 1. Buat `components/ui/modal.tsx`

Konfirmasi dialog untuk aksi destructive (delete property, dll).

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `onConfirm: () => void`
- `title: string`
- `message: string`
- `confirmLabel?: string` (default: "Hapus")
- `isLoading?: boolean` (disable tombol saat pending)

**Behavior:**
- Overlay gelap di belakang
- Klik overlay atau tombol "Batal" → tutup modal
- Tombol konfirmasi pakai variant `danger` dari Button
- Tidak ada animasi kompleks — cukup `fixed inset-0` overlay

### 2. Fix Badge variant name (minor)

Di `components/ui/badge.tsx`, rename tipe `"siap-huni-renovasi"` → `"siap-renovasi"` dan update `readinessMap` di `StatusBadge` agar konsisten dengan ISSUES.md spec.

> Cek dulu apakah ada consumer yang pakai string `"siap-huni-renovasi"` sebelum rename — grep seluruh codebase.

---

## Acceptance Criteria

- [ ] `Modal` bisa dipakai di delete property (Issue #6 flow)
- [ ] Badge variant konsisten dengan spec (`siap-renovasi`)
- [ ] Semua komponen tidak punya TypeScript error
- [ ] Komponen UI tidak import dari komponen lain yang depend on Supabase/server
