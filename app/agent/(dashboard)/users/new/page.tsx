"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createAdmin } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActionResult, User } from "@/lib/types";

export default function CreateAdminPage() {
  const [state, formAction, isPending] = useActionState<
    ActionResult<User>,
    FormData
  >(createAdmin, { success: false, error: "" });

  return (
    <div>
      <Link
        href="/agent/users"
        className="text-gold hover:underline mb-6 inline-block"
      >
        ← Kembali ke Daftar
      </Link>

      <div className="bg-white rounded-lg border border-gray-300 p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-primary mb-8">Tambah Admin</h1>

        {state.success === false && state.error && (
          <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red rounded-lg">
            <p className="text-accent-red font-medium">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <Input
            label="Nama"
            name="name"
            type="text"
            placeholder="Nama lengkap"
            required
            error={state.fieldErrors?.name?.[0]}
            disabled={isPending}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="email@example.com"
            required
            error={state.fieldErrors?.email?.[0]}
            disabled={isPending}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            required
            error={state.fieldErrors?.password?.[0]}
            disabled={isPending}
          />

          <div className="flex gap-4 pt-6 border-t border-gray-300">
            <Button
              type="submit"
              variant="gold-filled"
              disabled={isPending}
              className={isPending ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Link href="/agent/users">
              <Button type="button" variant="ghost">
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
