# Issue #4 — Public Pages: Landing, About, Contact

**Depends on:** Issue #1 (done), #2 (done)  
**Stack:** Next.js 16 App Router, Tailwind v4, Supabase, TypeScript  
**Design tokens already in `globals.css`:** `bg-primary`, `bg-gold`, `bg-accent-red`, `bg-soft-gray`

---

## Route Structure

```
app/(public)/
  layout.tsx          ← sticky header + footer (wraps all public pages)
  page.tsx            ← Landing (/)
  about/page.tsx      ← About Us (/about)
  contact/page.tsx    ← Contact Us (/contact)

app/api/contact/
  route.ts            ← POST handler (rate limit + invoke edge function)

lib/db/
  properties.ts       ← getProperties() — reused in Issue #5 too
  contact.ts          ← checkRateLimit() + recordSubmission()
```

---

## Phase 1 — Public Layout (Header + Footer)

Create `app/(public)/layout.tsx` as a Server Component wrapping all public pages.

**Header** (`components/public/header.tsx`) — sticky, `z-50`:
- Logo "Prime Property" (text or SVG, left side)
- Nav links: Beranda → `/`, Tentang Kami → `/about`, Kontak → `/contact`
- CTA: "Login Agent" button (gold outline style) → `/agent/login`
- Mobile: hamburger menu toggling nav links

**Footer** — inside layout.tsx directly or a separate component:
- Logo, kontak info (telp/WA/email as placeholder text), links to About & Contact
- Dark background (`bg-primary text-white`)

---

## Phase 2 — Landing Page (`/`)

Server Component. No client-side JS unless strictly necessary.

**Sections (top to bottom):**

1. **Hero** — full-width, `bg-primary`, tagline Prime Property, 1 CTA button gold-filled linking to `/contact`

2. **Featured Properties** — fetch 6 properties from Supabase with `status = 'in_stock'` via `lib/db/properties.ts`. Display as a responsive grid of cards showing: nama, tipe, lebar×panjang, harga (formatted with `lib/format.ts`), status badge. Read-only — no interaction needed.

3. **Why Prime Property** — 4 static value proposition cards with icon + judul + deskripsi (placeholder content OK)

**DB function to create:** `getProperties(filters)` in `lib/db/properties.ts`  
- For landing: call with `{ status: 'in_stock', perPage: 6, page: 1 }`  
- Make it reusable — Issue #5 will use the same function with full filters

---

## Phase 3 — About Page (`/about`)

Static Server Component. No DB calls.

- 2-column layout on desktop (text left, quote/visual right), 1-column on mobile
- Sections: profil perusahaan, visi & misi, nilai-nilai perusahaan
- Placeholder content in Bahasa Indonesia — keep it concise
- No forms or interactive elements

---

## Phase 4 — Contact Page + API

### Contact Page (`/contact`)

Client Component (needs form state). Use `useActionState` (React 19).

- Info kontak: alamat, telepon, WhatsApp link, email (placeholder values)
- Form fields: Nama, Email, Nomor HP, Pesan
- Zod validation both client and server side
- On success: show sonner toast "Pesan terkirim, tim kami akan menghubungi Anda."
- Error state: inline field errors in `text-accent-red`

### Contact API Route (`app/api/contact/route.ts`)

POST handler:
1. Parse & validate body with Zod (same schema as form)
2. Rate limit: check `contact_submissions` table — reject if ≥3 submissions from same IP in last 60 minutes
3. Record submission to `contact_submissions`
4. Invoke Supabase Edge Function `send-contact-email` (Issue #8 will implement the actual function — for now just call it and handle error gracefully)
5. Return `{ success: true }` or error JSON

### DB helpers (`lib/db/contact.ts`):
- `checkRateLimit(ip: string): Promise<boolean>` — returns true if allowed
- `recordSubmission(ip: string): Promise<void>`

---

## Phase 5 — UI Components

Create reusable components needed for public pages. These also lay groundwork for Issue #9.

| File | Purpose |
|---|---|
| `components/ui/button.tsx` | Variants: `gold-filled`, `gold-outline`, `ghost` |
| `components/ui/badge.tsx` | Status badges: in-stock (green), sold-out (red) |
| `components/ui/input.tsx` | Text/email/tel inputs with error state |
| `components/ui/textarea.tsx` | For contact message field |
| `components/ui/toast-provider.tsx` | Wrap `sonner` Toaster, add to public layout |

---

## Key Constraints

- All text in **Bahasa Indonesia**
- Format harga: `Rp 1.350.000.000` via `lib/format.ts` `formatPrice()` (already exists)
- **No dark mode** — light only
- Responsive: mobile ≤640px, tablet ≤1024px, desktop ≥1024px
- Public pages must be Server Components by default (FCP < 1.5s)
- Contact form: only the form itself needs `"use client"`, not the whole page
- IP for rate limiting: read from `x-forwarded-for` header or `request.ip`
- Edge function call can be fire-and-forget with graceful error handling (don't fail submission if email fails)

---

## What's NOT in scope for this issue

- Supabase Edge Function implementation → Issue #8
- Full filter/search on properties → Issue #5
- Property detail page → Issue #5
- UI Component Library completeness → Issue #9
