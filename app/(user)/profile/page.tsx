"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRole } from "@/app/context/AuthContext";
import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import { ApiError } from "@/types/ApiError";

type ProfileData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  createdAt: string;
  roles: string[];
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export default function ProfilePage() {
  const { loggedUser, loading: authLoading } = useRole();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initials = useMemo(() => {
    if (profile?.firstName || profile?.lastName) {
      return `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
    }
    return (profile?.email?.[0] ?? loggedUser?.email?.[0] ?? "U").toUpperCase();
  }, [profile, loggedUser]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await apiClient.get<ApiResponse<ProfileData>>("/profile");
        setProfile(res.data.data);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Unable to load your profile.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) loadProfile();
  }, [authLoading]);

  return (
    <main className="bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
        </div>
        <div className="container relative px-4 pt-12 pb-14 lg:px-0">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                Your Account
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-white lg:text-5xl">
                Profile & Preferences
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-200">
                Keep your details up to date, review access roles, and jump back
                into your bookings without losing your momentum.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/profile/bookings"
                className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-white"
              >
                View bookings
              </Link>
              <Link
                href="/movies"
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white/90 transition hover:border-white/60 hover:text-white"
              >
                Browse movies
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 text-slate-900 pt-12">
        <div className="container -mt-10 grid gap-6 px-4 pb-14 lg:grid-cols-[1.1fr_1fr] lg:px-0">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
            <div className="flex flex-col gap-6 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-semibold text-white shadow-inner">
                {initials}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Profile
                </p>
                <h2 className="text-2xl font-semibold">
                  {profile
                    ? `${profile.firstName} ${profile.lastName}`
                    : (loggedUser?.email ?? "Guest")}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Member since {formatDate(profile?.createdAt)}
                </p>
              </div>
              <div className="sm:ml-auto">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active account
                </span>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  First name
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {profile?.firstName ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Last name
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {profile?.lastName ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Email
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {profile?.email ?? loggedUser?.email ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Account ID
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {profile?.id ?? loggedUser?.userId ?? "—"}
                </p>
              </div>
            </div>

            {/* <div className="flex flex-wrap gap-3 border-t border-slate-100 px-6 py-6">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Roles</span>
              {(profile?.roles?.length ? profile.roles : loggedUser?.roles ?? []).map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {role}
                </span>
              ))}
              {!profile?.roles?.length && !loggedUser?.roles?.length && (
                <span className="text-xs text-slate-500">No roles assigned</span>
              )}
            </div> */}
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Account status
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                {loading ? "Loading profile..." : "Everything is ready"}
              </h3>
              <p className="mt-3 text-sm text-slate-500">
                We use your details to personalize events, tickets, and venue
                suggestions.
              </p>
              {error && (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
              {!error && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Your profile data is synced with our booking system.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Quick links
              </p>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/profile/bookings"
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Upcoming bookings
                  <span className="text-slate-400">→</span>
                </Link>
                <Link
                  href="/movies"
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Now showing
                  <span className="text-slate-400">→</span>
                </Link>
                <Link
                  href="/venues"
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Event venues
                  <span className="text-slate-400">→</span>
                </Link>
                <Link
                  href="/profile/change-password"
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Change password
                  <span className="text-slate-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
