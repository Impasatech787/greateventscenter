"use client";

import { X } from "lucide-react";
import React, { useMemo, useState } from "react";
import apiClient from "@/lib/axios";

interface RefundRequestModalProps {
  bookingId: number;
  movieName: string;
  amountCents: number;
  onClose: () => void;
  onRefunded?: () => void;
}

export default function RefundRequestModal({
  bookingId,
  movieName,
  amountCents,
  onClose,
  onRefunded,
}: RefundRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<null | {
    refundId?: string;
    status?: string;
  }>(null);

  const amountLabel = useMemo(() => {
    const n = (amountCents ?? 0) / 100;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(n);
    } catch {
      return String(n);
    }
  }, [amountCents]);

  const requestRefund = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await apiClient.post(
        `/bookings/${encodeURIComponent(String(bookingId))}/request-refund`
      );
      const refundId = res?.data?.refund?.id ?? res?.data?.refundId;
      const status = res?.data?.refund?.status;
      setSuccess({ refundId, status });
      onRefunded?.();
    } catch (e: unknown) {
      const err = e as {
        message?: string;
        response?: { data?: { error?: string } };
      };
      const message =
        err?.response?.data?.error ??
        err?.message ??
        "Failed to request refund";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m6-6H6"
              />
            </svg>
            Request Refund
          </h2>
          <button
            className="text-gray-400 hover:text-gray-700 transition-colors"
            onClick={onClose}
            aria-label="Close"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 py-6">
          {!success ? (
            <>
              <div className="rounded-xl border bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  You’re about to request a refund for
                  <span className="font-semibold text-gray-900">
                    {" "}
                    “{movieName}”.
                  </span>
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Refund amount</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {amountLabel}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                If eligible, Stripe will process the refund. Depending on your
                bank, it may take a few business days to appear.
              </p>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6 flex w-full justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-medium transition shadow-sm"
                  disabled={isSubmitting}
                >
                  Not now
                </button>
                <button
                  onClick={requestRefund}
                  className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold transition shadow-md border border-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Requesting..." : "Confirm refund"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-800">
                  Refund request submitted.
                </p>
                <p className="mt-1 text-sm text-green-800/90">
                  {success.status
                    ? `Status: ${success.status}`
                    : "Stripe is processing your refund."}
                </p>
                {success.refundId && (
                  <p className="mt-2 text-xs text-green-900/80">
                    Refund ID: {success.refundId}
                  </p>
                )}
              </div>

              <div className="mt-6 flex w-full justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 font-semibold transition shadow-md"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
