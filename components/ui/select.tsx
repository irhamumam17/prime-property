"use client";

import React from "react";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  isMulti?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, isMulti = false, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-primary mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          multiple={isMulti}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none disabled:opacity-50 ${className} ${
            error ? "border-accent-red" : ""
          }`}
          {...props}
        >
          {!isMulti && <option value="">Pilih...</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-accent-red text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
