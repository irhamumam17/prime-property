"use client";

import { useActionState, useState } from "react";
import { resetUserPassword } from "./actions";
import type { ActionResult } from "@/lib/types";

interface ResetPasswordButtonProps {
  userId: string;
  userName: string;
}

export function ResetPasswordButton({
  userId,
  userName,
}: ResetPasswordButtonProps) {
  const [state, formAction, isPending] = useActionState<
    ActionResult<{ newPassword: string }>,
    FormData
  >(async () => resetUserPassword(userId), {
    success: false,
    error: "",
  });

  if (state.success && state.data?.newPassword) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm">
          <h3 className="text-lg font-bold text-primary mb-4">
            Password Reset untuk {userName}
          </h3>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <p className="text-sm text-gray-600 mb-2">Password baru:</p>
            <p className="font-mono text-lg font-bold text-primary break-all">
              {state.data.newPassword}
            </p>
          </div>
          <p className="text-sm text-accent-red mb-4">
            ⚠️ Salin password ini. Anda hanya akan melihatnya sekali.
          </p>
          <button
            onClick={() => location.reload()}
            className="w-full px-4 py-2 bg-gold text-primary rounded-lg font-medium hover:bg-yellow-600 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={isPending}
        className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition disabled:opacity-50"
      >
        {isPending ? "Reset..." : "Reset Password"}
      </button>
    </form>
  );
}
