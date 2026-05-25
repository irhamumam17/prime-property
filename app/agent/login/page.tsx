"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import type { ActionResult } from "@/lib/types";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(
    loginAction,
    { success: false, error: "" }
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Prime Property</h1>
        <p className="text-gray-600 mb-8">Login Agen Internal</p>

        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
              disabled={isPending}
            />
            {!state?.success && state?.fieldErrors?.email && (
              <p className="text-accent-red text-sm mt-1">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
              disabled={isPending}
            />
            {!state?.success && state?.fieldErrors?.password && (
              <p className="text-accent-red text-sm mt-1">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>

          {!state?.success && state?.error && (
            <div className="bg-red-50 border border-accent-red rounded-lg p-4">
              <p className="text-accent-red text-sm">{state.error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gold text-primary font-semibold py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
