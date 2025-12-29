"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type StatusType = "idle" | "loading" | "success" | "error";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<StatusType>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setStatus("error");
      setMessage("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (!token) {
      setStatus("error");
      setMessage("Reset token is missing.");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const errorMessage =
          (data && (data.error || data.message)) || "Unable to reset password.";
        throw new Error(errorMessage);
      }
      setStatus("success");
      setMessage(data?.message || "Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to reset password.";
      setStatus("error");
      setMessage(errorMessage);
    }
  };

  return (
    <main className="bg-slate-950 text-white min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
        </div>
        <div className="container relative px-4 pt-16 pb-12 lg:px-0">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
            Account recovery
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-white lg:text-5xl">
            Reset Password
          </h1>
          <p className="mt-3 max-w-xl text-base text-slate-200">
            Choose a new password to regain access to your account.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 text-slate-900 pt-12">
        <div className="container -mt-6 px-4 pb-14 lg:px-0">
          <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30">
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  New password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter new password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Updating..." : "Update password"}
              </button>
            </form>

            {status !== "idle" && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${status === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
              >
                {message}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link
                href="/signin"
                className="text-slate-700 hover:text-slate-900 hover:underline"
              >
                Back to sign in
              </Link>
              <Link
                href="/forgot-password"
                className="text-slate-700 hover:text-slate-900 hover:underline"
              >
                Request another reset link
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
