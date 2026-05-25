"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase";
import {
  getUserByEmail,
  getUserCredentialsByEmail,
  verifyPassword,
} from "@/lib/db/users";
import { createSession } from "@/lib/session";
import type { ActionResult } from "@/lib/types";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

async function checkLoginLockout(
  email: string
): Promise<{ locked: true; remainingMinutes: number } | { locked: false }> {
  const client = createServiceClient();
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const { data } = await client
    .from("login_attempts")
    .select("attempted_at")
    .eq("email", email)
    .eq("success", false)
    .gt("attempted_at", thirtyMinutesAgo)
    .order("attempted_at", { ascending: true });

  if (!data || data.length < 5) return { locked: false };

  const oldestAttempt = new Date(data[0].attempted_at);
  const lockoutEnds = new Date(oldestAttempt.getTime() + 30 * 60 * 1000);
  const remainingMs = lockoutEnds.getTime() - Date.now();
  const remainingMinutes = Math.ceil(remainingMs / 60 / 1000);

  return { locked: true, remainingMinutes };
}

async function recordLoginAttempt(
  email: string,
  success: boolean
): Promise<void> {
  const client = createServiceClient();
  await client.from("login_attempts").insert([
    {
      email,
      success,
    },
  ]);
}

export async function loginAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const lockoutCheck = await checkLoginLockout(email);
    if (lockoutCheck.locked) {
      return {
        success: false,
        error: `Akun terkunci. Coba lagi dalam ${lockoutCheck.remainingMinutes} menit.`,
      };
    }

    const user = await getUserByEmail(email);
    if (!user) {
      await recordLoginAttempt(email, false);
      return {
        success: false,
        error: "Email atau password salah",
      };
    }

    if (!user.isActive) {
      await recordLoginAttempt(email, false);
      return {
        success: false,
        error: "Akun tidak aktif",
      };
    }

    const credentials = await getUserCredentialsByEmail(email);
    if (!credentials) {
      await recordLoginAttempt(email, false);
      return {
        success: false,
        error: "Email atau password salah",
      };
    }

    const passwordValid = await verifyPassword(password, credentials.passwordHash);
    if (!passwordValid) {
      await recordLoginAttempt(email, false);
      return {
        success: false,
        error: "Email atau password salah",
      };
    }

    await recordLoginAttempt(email, true);
    await createSession({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    redirect("/agent/properties");
  } catch (err) {
    console.error("Login action error:", err);
    return {
      success: false,
      error: "Terjadi kesalahan saat login",
    };
  }
}
