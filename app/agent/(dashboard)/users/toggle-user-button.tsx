"use client";

import { useActionState } from "react";
import { toggleUserActive } from "./actions";
import type { ActionResult } from "@/lib/types";

interface ToggleUserButtonProps {
  userId: string;
  isActive: boolean;
  canToggle: boolean;
}

export function ToggleUserButton({
  userId,
  isActive,
  canToggle,
}: ToggleUserButtonProps) {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    async () => toggleUserActive(userId, isActive),
    { success: false, error: "" }
  );

  if (!canToggle) {
    return (
      <button disabled className="px-3 py-1 text-xs font-medium opacity-50 cursor-not-allowed">
        {isActive ? "Nonaktifkan" : "Aktifkan"}
      </button>
    );
  }

  return (
    <form action={formAction}>
      <button
        type="submit"
        className={`px-3 py-1 text-xs font-medium rounded transition ${
          isActive
            ? "bg-accent-red text-white hover:bg-red-700"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }`}
      >
        {isActive ? "Nonaktifkan" : "Aktifkan"}
      </button>
    </form>
  );
}
