"use client";

import apiClient from "@/lib/axios";
import { ApiError } from "@/types/ApiError";
import { Ban, X } from "lucide-react";
import React, { useState } from "react";

interface CancelBookingModalProps {
  bookingId: number;
  movieName: string;
  onClose: () => void;
  onCancelled?: () => void;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  bookingId,
  movieName,
  onClose,
  onCancelled,
}) => {
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const onConfirm = async () => {
    try {
      setErrorMessage("");
      setIsCancelling(true);
      const res = await apiClient.post(`/bookings/${bookingId}/cancel`, {});
      setSuccessMessage(res?.data?.message ?? "Cancellation successful");
      onCancelled?.();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        const err = error as {
          message?: string;
          response?: { data?: { error?: string } };
        };
        setErrorMessage(
          err?.response?.data?.error ?? err?.message ?? "Cancellation failed"
        );
      }
    } finally {
      setIsCancelling(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-red-700 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Cancel Booking
          </h2>
          <button
            className="text-gray-400 hover:text-gray-700 transition-colors"
            onClick={onClose}
            aria-label="Close"
            disabled={isCancelling}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="px-8 py-6">
          {successMessage ? (
            <>
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-800">
                  Booking cancelled.
                </p>
                <p className="mt-1 text-sm text-green-800/90">
                  {successMessage}
                </p>
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
          ) : (
            <>
              <div className="rounded-xl border bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  You’re about to cancel
                  <span className="font-semibold text-gray-900">
                    {" "}
                    “{movieName}”.
                  </span>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Cancellation is allowed up to 2 hours before the show.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  This action{" "}
                  <span className="font-semibold text-red-600">
                    cannot be undone
                  </span>
                  .
                </p>
              </div>

              {!isCancelling && errorMessage && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start gap-2">
                  <Ban size={18} className="text-red-700 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="mt-6 flex w-full justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-medium transition shadow-sm"
                  disabled={isCancelling}
                >
                  Not now
                </button>
                <button
                  onClick={onConfirm}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition shadow-md border border-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Confirm cancel"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
