# Issue #8 — Email Notification (Supabase Edge Function + Resend)

**Stack:** Supabase Edge Function (Deno) · Resend API  
**Depends on:** Issue #4 (contact form + `app/api/contact/route.ts` sudah ada)  
**Branch:** `feature/issue-8-email-notification`

---

## Context

Contact form dan API route (`app/api/contact/route.ts`) sudah jalan — validasi, rate limit, dan `recordSubmission()` sudah ada. Route sudah memanggil `client.functions.invoke("send-contact-email", ...)` tapi edge function-nya belum ada. Issue ini hanya membuat edge function tersebut dan deploy ke Supabase.

**Tidak perlu ubah Next.js** — semua perubahan ada di folder `supabase/functions/`.

---

## Files to Create

| File | Action |
|------|--------|
| `supabase/functions/send-contact-email/index.ts` | CREATE — Deno edge function |

---

## Edge Function (`send-contact-email/index.ts`)

Deno HTTP handler yang:

1. **Terima request** body JSON: `{ name, email, phone, message }`
2. **Kirim email** via Resend API ke alamat dari env var `ADMIN_EMAIL`
3. **Return** `{ success: true }` atau error JSON

### Template email
```
Subject : [Prime Property] Pesan baru dari {name}
Body    :
  Nama    : {name}
  Email   : {email}
  HP      : {phone}
  Pesan   : {message}
```

### Pola kode Deno edge function
```ts
import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { name, email, phone, message } = await req.json();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "no-reply@prime-pro.irhamu.dev",
      to: Deno.env.get("ADMIN_EMAIL"),
      subject: `[Prime Property] Pesan baru dari ${name}`,
      text: `Nama: ${name}\nEmail: ${email}\nHP: ${phone}\nPesan: ${message}`,
    }),
  });

  if (!res.ok) return new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
```

---

## Setup & Deploy

Setelah membuat file, jalankan:

```bash
# Set secrets di Supabase project
supabase secrets set RESEND_API_KEY=<your_key>
supabase secrets set ADMIN_EMAIL=<your_email>

# Deploy edge function
supabase functions deploy send-contact-email
```

---

## Acceptance Criteria

- [ ] Submit contact form → email masuk ke `ADMIN_EMAIL`
- [ ] Email berisi nama, email, HP, dan pesan dari form
- [ ] Jika Resend gagal, error di-log tapi response ke user tetap sukses (fire-and-forget sudah dihandle di route.ts)
- [ ] Edge function ter-deploy di Supabase project
