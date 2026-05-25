import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-primary mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all ${
          error ? "border-accent-red focus:ring-accent-red" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-accent-red text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-600 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}
