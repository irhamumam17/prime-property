import React from "react";

type ButtonVariant = "gold-filled" | "gold-outline" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  "gold-filled": "bg-gold text-primary hover:bg-opacity-90 transition-colors",
  "gold-outline":
    "border border-gold text-gold hover:bg-gold hover:text-primary transition-colors",
  danger: "bg-accent-red text-white hover:bg-opacity-90 transition-colors",
  ghost: "text-primary hover:bg-soft-gray transition-colors",
};

export function Button({
  variant = "gold-filled",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-6 py-3 font-medium rounded-lg transition-all ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
