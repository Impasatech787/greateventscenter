"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type VerificationState = "idle" | "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerificationState>("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setState("error");
        setMessage("Verification token is missing.");
        return;
      }
      setState("loading");
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const errorMessage =
            (data && (data.error || data.message)) || "Verification failed.";
          throw new Error(errorMessage);
        }
        setState("success");
        setMessage(data?.message || "Your email has been verified.");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Verification failed.";
        setState("error");
        setMessage(errorMessage);
      }
    };

    verify();
  }, [token]);

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
            Account verification
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-white lg:text-5xl">
            Verify Email
          </h1>
          <p className="mt-3 max-w-xl text-base text-slate-200">
            We are confirming your email address. You can sign in once verification is complete.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 text-slate-900 pt-9">
        <div className="container -mt-6 px-4 pb-14 lg:px-0">
          <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30">
            <h2 className="text-2xl font-semibold text-slate-900">
              {state === "loading" ? "Verifying..." : "Verification status"}
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              {state === "loading"
                ? "Please wait while we verify your email."
                : message}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/signin"
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Go to sign in
              </Link>
              <Link
                href="/"
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
