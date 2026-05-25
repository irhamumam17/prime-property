import React from "react";
import type { PropertyStatus, PropertyReadiness } from "@/lib/types";

type BadgeVariant = "in-stock" | "sold-out" | "siap-huni" | "siap-kosong" | "siap-huni-renovasi";

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  "in-stock": "bg-green-100 text-green-800",
  "sold-out": "bg-accent-red bg-opacity-10 text-accent-red",
  "siap-huni": "bg-gold bg-opacity-20 text-gold",
  "siap-kosong": "bg-purple-100 text-purple-800",
  "siap-huni-renovasi": "bg-blue-100 text-blue-800",
};

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}

interface StatusBadgeProps {
  status: PropertyStatus;
  readiness: PropertyReadiness;
}

export function StatusBadge({ status, readiness }: StatusBadgeProps) {
  if (status === "sold_out") {
    return <Badge variant="sold-out" label="Sold Out" />;
  }

  const readinessMap: Record<PropertyReadiness, BadgeVariant> = {
    siap_huni: "siap-huni",
    siap_kosong: "siap-kosong",
    siap_huni_renovasi: "siap-huni-renovasi",
  };

  const readinessLabel: Record<PropertyReadiness, string> = {
    siap_huni: "Siap Huni",
    siap_kosong: "Siap Kosong",
    siap_huni_renovasi: "Siap Renovasi",
  };

  return (
    <Badge
      variant={readinessMap[readiness]}
      label={readinessLabel[readiness]}
    />
  );
}
