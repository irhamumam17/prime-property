import { deleteSession } from "@/lib/session";

export async function GET() {
  await deleteSession();
  return Response.redirect(new URL("/agent/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}
