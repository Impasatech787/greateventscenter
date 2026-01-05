"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function EventBookingCancel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = useMemo(
    () => searchParams.get("bookingId") ?? "",
    [searchParams],
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Payment canceled
        </p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Your booking was not completed
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          If you’d like to try again, return to the event checkout page.
        </p>
        {bookingId && (
          <p className="mt-3 text-xs text-gray-500">Booking ID: {bookingId}</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={() => router.push("/events")}>Back to events</Button>
          <Button variant="secondary" onClick={() => router.back()}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function EventBookingCancelPage() {
  return (
    <Suspense>
      <EventBookingCancel />
    </Suspense>
  );
}
