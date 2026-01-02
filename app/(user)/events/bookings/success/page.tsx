"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type VerifyState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      result?: {
        bookingId?: string | number;
        ticketPdfUrl?: string;
      };
    }
  | { status: "error"; message: string };

export default function EventBookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = useMemo(
    () => searchParams.get("session_id") ?? "",
    [searchParams],
  );
  const bookingId = useMemo(
    () => searchParams.get("bookingId") ?? "",
    [searchParams],
  );

  const [state, setState] = useState<VerifyState>({ status: "idle" });
  const didAutoVerifyRef = useRef(false);

  const verifyBooking = useCallback(async () => {
    if (!sessionId && !bookingId) {
      setState({
        status: "error",
        message: "We couldn't find your booking details. Please try again.",
      });
      return;
    }

    setState({ status: "loading" });
    try {
      const token = localStorage.getItem("authToken") || "";
      const response = await fetch("/api/events/bookings/verify-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          paymentSessionId: sessionId || undefined,
          bookingId: bookingId || undefined,
        }),
      });

      const data: unknown = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message =
          typeof (data as { error?: unknown })?.error === "string"
            ? (data as { error: string }).error
            : "Booking verification failed.";
        setState({ status: "error", message });
        return;
      }

      const apiData = (data as { data?: unknown })?.data;
      const result =
        apiData && typeof apiData === "object"
          ? {
              bookingId:
                typeof (apiData as { bookingId?: unknown })?.bookingId ===
                "string"
                  ? (apiData as { bookingId: string }).bookingId
                  : typeof (apiData as { bookingId?: unknown })?.bookingId ===
                      "number"
                    ? (apiData as { bookingId: number }).bookingId
                    : bookingId || undefined,
              ticketPdfUrl:
                typeof (apiData as { ticketPdfUrl?: unknown })?.ticketPdfUrl ===
                "string"
                  ? (apiData as { ticketPdfUrl: string }).ticketPdfUrl
                  : undefined,
            }
          : undefined;

      setState({ status: "success", result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Server error";
      setState({ status: "error", message });
    }
  }, [bookingId, sessionId]);

  useEffect(() => {
    if (didAutoVerifyRef.current) return;
    if (!sessionId && !bookingId) return;

    didAutoVerifyRef.current = true;
    const timeoutId = window.setTimeout(() => {
      void verifyBooking();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [bookingId, sessionId, verifyBooking]);

  const title =
    state.status === "success"
      ? "Event booking confirmed"
      : state.status === "loading"
        ? "Confirming your booking"
        : state.status === "error"
          ? "We couldn't confirm your booking"
          : "Payment received";

  const description =
    state.status === "success"
      ? "Your ticket is ready. Download it below."
      : state.status === "loading"
        ? "This can take a few seconds. Please don’t close this page."
        : state.status === "error"
          ? "If the payment succeeded, you can retry confirmation."
          : "We’re preparing your ticket.";

  const ticketPdfUrl =
    state.status === "success" ? state.result?.ticketPdfUrl : "";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-center justify-center text-center">
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-foreground">
              <span className="text-3xl font-semibold leading-none">
                {state.status === "success"
                  ? "✓"
                  : state.status === "error"
                    ? "×"
                    : "…"}
              </span>
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="max-w-sm">
              {description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {state.status === "error" ? (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {state.message}
            </div>
          ) : (
            <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
              Your ticket will open in a new tab when available.
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={() => {
              if (ticketPdfUrl) {
                window.open(ticketPdfUrl, "_blank", "noopener,noreferrer");
                return;
              }
              if (bookingId) {
                void verifyBooking();
              }
            }}
            disabled={state.status === "loading"}
          >
            {ticketPdfUrl ? "Download ticket" : "Check ticket"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => router.push("/events")}
          >
            Back to events
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
