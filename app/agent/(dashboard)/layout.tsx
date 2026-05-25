import { verifySession } from "@/lib/dal";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader session={session} />
      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
