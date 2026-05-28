import Link from "next/link";
import { verifySuperadmin } from "@/lib/dal";
import { getAllUsers } from "@/lib/db/users";
import { Button } from "@/components/ui/button";
import { ResetPasswordButton } from "./reset-password-button";
import { ToggleUserButton } from "./toggle-user-button";
import { formatDate } from "@/lib/format";

export default async function UsersPage() {
  const session = await verifySuperadmin();
  const users = await getAllUsers();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Kelola Admin</h1>
        <Link href="/agent/users/new">
          <Button variant="gold-filled">+ Tambah Admin</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                  Dibuat
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-primary">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-3 py-1 bg-gray-200 text-primary rounded-full text-xs font-medium">
                      {user.role === "superadmin" ? "Superadmin" : "Admin"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {user.isActive ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-accent-red rounded-full text-xs font-medium">
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2 flex">
                    {user.role !== "superadmin" && (
                      <ToggleUserButton
                        userId={user.id}
                        isActive={user.isActive}
                        canToggle={user.id !== session.userId}
                      />
                    )}
                    <ResetPasswordButton userId={user.id} userName={user.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>Belum ada admin terdaftar</p>
          </div>
        )}
      </div>
    </div>
  );
}
