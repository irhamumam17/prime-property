import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-primary mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none ${
          error ? "border-accent-red focus:ring-accent-red" : ""
        } ${className}`}
        rows={5}
        {...props}
      />
      {error && <p className="text-accent-red text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-600 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}
