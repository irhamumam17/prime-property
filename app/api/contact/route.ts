import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, recordSubmission } from "@/lib/db/contact";
import { createServiceClient } from "@/lib/supabase";

const contactSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(100),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(1, "Nomor HP harus diisi").max(20),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    // Check rate limit
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak permintaan. Coba lagi nanti." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Data tidak valid",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = parsed.data;

    // Record submission
    await recordSubmission(ip);

    // Invoke Supabase Edge Function to send email
    // For now, fire-and-forget to avoid blocking the response
    const client = createServiceClient();
    client.functions
      .invoke("send-contact-email", {
        body: { name, email, phone, message },
      })
      .catch((err) => {
        console.error("Failed to send email:", err);
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
