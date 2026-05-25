import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import type { SessionPayload } from "@/lib/types";

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return decrypt(session);
});

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session) redirect("/agent/login");
  return session;
});

export const verifySuperadmin = cache(async (): Promise<SessionPayload> => {
  const session = await verifySession();
  if (session.role !== "superadmin") {
    throw new Error("Unauthorized: superadmin role required");
  }
  return session;
});
