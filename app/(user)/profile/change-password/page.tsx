"use client";

import Link from "next/link";
import ChangePasswordCard from "@/components/elements/ChangePasswordCard";

export default function ChangePasswordPage() {
  return (
    <main className="bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
        </div>
        <div className="container relative px-4 pt-12 pb-10 lg:px-0">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
            Security
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-white lg:text-5xl">
            Change Password
          </h1>
          <p className="mt-3 max-w-xl text-base text-slate-200">
            Keep your account protected by updating your password.
          </p>
          <div className="mt-6">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white/90 transition hover:border-white/60 hover:text-white"
            >
              ← Back to profile
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 text-slate-900 pt-12">
        <div className="container -mt-6 px-4 pb-14 lg:px-0">
          <div className="max-w-2xl">
            <ChangePasswordCard />
          </div>
        </div>
      </section>
    </main>
  );
}
