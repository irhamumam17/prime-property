import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAgentPath = pathname.startsWith("/agent");
  const isLoginPage = pathname === "/agent/login";

  if (!isAgentPath) return NextResponse.next();

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const decrypted = session ? await decrypt(session) : null;

  if (!decrypted) {
    if (isLoginPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/agent/login", request.url));
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL("/agent/properties", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/agent/:path*"],
};
