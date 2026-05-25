import Link from "next/link";
import type { SessionPayload } from "@/lib/types";

interface DashboardHeaderProps {
  session: SessionPayload;
}

export async function DashboardHeader({ session }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/agent" className="text-2xl font-bold text-primary">
          Prime Property
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/agent/properties"
            className="text-sm font-medium text-primary hover:text-gold transition"
          >
            Properti
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">{session.name}</p>
            <p className="text-xs text-gray-600">{session.role}</p>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
