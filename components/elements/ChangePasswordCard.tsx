"use client";

import { useState } from "react";

type PasswordStatus = {
  type: "idle" | "error" | "success";
  message: string;
};

const initialFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePasswordCard = () => {
  const [passwordForm, setPasswordForm] = useState(initialFormState);
  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus>({
    type: "idle",
    message: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const submitPasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordStatus({ type: "idle", message: "" });

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordStatus({ type: "error", message: "Please fill in all password fields." });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: "error", message: "New password and confirmation do not match." });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setPasswordStatus({ type: "error", message: "Please sign in to change your password." });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Unable to update password.");
      }
      setPasswordStatus({ type: "success", message: "Password updated successfully." });
      setPasswordForm(initialFormState);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update password.";
      setPasswordStatus({ type: "error", message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Security</p>
      <h3 className="mt-2 text-2xl font-semibold text-slate-900">Change password</h3>
      <p className="mt-2 text-sm text-slate-500">
        Update your password regularly to keep your account secure.
      </p>
      <form className="mt-4 grid gap-3" onSubmit={submitPasswordChange}>
        <input
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          placeholder="Current password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
          value={passwordForm.currentPassword}
          onChange={(event) =>
            setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
          }
        />
        <input
          type="password"
          name="newPassword"
          autoComplete="new-password"
          placeholder="New password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
          value={passwordForm.newPassword}
          onChange={(event) =>
            setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
          }
        />
        <input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm new password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
          value={passwordForm.confirmPassword}
          onChange={(event) =>
            setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
          }
        />
        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isUpdatingPassword}
        >
          {isUpdatingPassword ? "Updating..." : "Update password"}
        </button>
      </form>
      {passwordStatus.type !== "idle" && (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
            passwordStatus.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {passwordStatus.message}
        </div>
      )}
    </div>
  );
};

export default ChangePasswordCard;
