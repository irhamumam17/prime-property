"use client";

import React from "react";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Hapus",
  isLoading = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-96 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-primary mb-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
