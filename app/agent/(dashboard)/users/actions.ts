"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { verifySuperadmin } from "@/lib/dal";
import {
  createUser,
  setUserActive,
  updateUserPassword,
  getUserByEmail,
} from "@/lib/db/users";
import { recordAudit } from "@/lib/db/audit";
import type { ActionResult, User } from "@/lib/types";

const createAdminSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type CreateAdminInput = z.infer<typeof createAdminSchema>;

function generateRandomPassword(length: number = 12): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createAdmin(
  formData: FormData
): Promise<ActionResult<User>> {
  try {
    const session = await verifySuperadmin();

    const data: CreateAdminInput = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validation = createAdminSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(err.message);
      });
      return { success: false, error: "Validasi gagal", fieldErrors };
    }

    const existing = await getUserByEmail(validation.data.email);
    if (existing) {
      return {
        success: false,
        error: "Email sudah terdaftar",
        fieldErrors: { email: ["Email sudah digunakan"] },
      };
    }

    const newUser = await createUser({
      email: validation.data.email,
      name: validation.data.name,
      password: validation.data.password,
      role: "admin",
    });

    await recordAudit({
      userId: session.userId,
      entityType: "user",
      entityId: newUser.id,
      action: "create",
      changes: { name: newUser.name, email: newUser.email, role: "admin" },
    });

    redirect("/agent/users");
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("Unauthorized")) {
        return { success: false, error: "Anda tidak memiliki akses" };
      }
      return { success: false, error: err.message };
    }
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function toggleUserActive(
  userId: string,
  currentStatus: boolean
): Promise<ActionResult> {
  try {
    const session = await verifySuperadmin();

    if (userId === session.userId) {
      return {
        success: false,
        error: "Anda tidak bisa nonaktifkan akun sendiri",
      };
    }

    const newStatus = !currentStatus;
    await setUserActive(userId, newStatus);

    await recordAudit({
      userId: session.userId,
      entityType: "user",
      entityId: userId,
      action: "update",
      changes: { is_active: { old: currentStatus, new: newStatus } },
    });

    revalidatePath("/agent/users");
    return { success: true };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("Unauthorized")) {
        return { success: false, error: "Anda tidak memiliki akses" };
      }
      return { success: false, error: err.message };
    }
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function resetUserPassword(
  userId: string
): Promise<ActionResult<{ newPassword: string }>> {
  try {
    const session = await verifySuperadmin();

    const newPassword = generateRandomPassword(12);
    await updateUserPassword(userId, newPassword);

    await recordAudit({
      userId: session.userId,
      entityType: "user",
      entityId: userId,
      action: "update",
      changes: { password: "reset" },
    });

    return {
      success: true,
      data: { newPassword },
    };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("Unauthorized")) {
        return { success: false, error: "Anda tidak memiliki akses" };
      }
      return { success: false, error: err.message };
    }
    return { success: false, error: "Terjadi kesalahan" };
  }
}
