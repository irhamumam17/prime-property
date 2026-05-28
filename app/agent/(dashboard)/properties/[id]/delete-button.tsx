"use client";

import { useActionState } from "react";
import { deleteProperty } from "../actions";
import type { ActionResult } from "@/lib/types";

interface DeletePropertyButtonProps {
  propertyId: string;
  propertyName: string;
}

export function DeletePropertyButton({
  propertyId,
  propertyName,
}: DeletePropertyButtonProps) {
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(
    async () => {
      const confirmed = confirm(
        `Apakah Anda yakin ingin menghapus "${propertyName}"? Aksi ini tidak dapat dibatalkan.`
      );
      if (!confirmed) {
        return { success: false, error: "Pembatalan penghapusan" };
      }
      return deleteProperty(propertyId);
    },
    { success: false, error: "" }
  );

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Menghapus..." : "Hapus"}
      </button>
    </form>
  );
}
