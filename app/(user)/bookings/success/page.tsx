"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
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
        ticketUrl?: string;
        ticketPdfUrl?: string;
        ticketImageUrl?: string;
      };
    }
  | { status: "error"; message: string };

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = useMemo(
    () => searchParams.get("session_id") ?? "",
    [searchParams]
  );
  const bookingId = useMemo(
    () => searchParams.get("bookingId") ?? "",
    [searchParams]
  );

  const [state, setState] = useState<VerifyState>({ status: "idle" });
  const didAutoVerifyRef = useRef(false);

  const ticketUrl = state.status === "success" ? state.result?.ticketUrl : "";
  const ticketPdfUrl =
    state.status === "success" ? state.result?.ticketPdfUrl : "";
  const ticketImageUrl =
    state.status === "success" ? state.result?.ticketImageUrl : "";

  const verifyBooking = useCallback(async () => {
    if (!sessionId) {
      setState({
        status: "error",
        message: "We couldn't find your payment session. Please try again.",
      });
      return;
    }

    setState({ status: "loading" });
    try {
      const token = localStorage.getItem("authToken") || "";
      const response = await fetch("/api/bookings/verify-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ paymentSessionId: sessionId }),
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
              ticketUrl:
                typeof (apiData as { ticketUrl?: unknown })?.ticketUrl ===
                "string"
                  ? (apiData as { ticketUrl: string }).ticketUrl
                  : undefined,
              ticketPdfUrl:
                typeof (apiData as { ticketPdfUrl?: unknown })?.ticketPdfUrl ===
                "string"
                  ? (apiData as { ticketPdfUrl: string }).ticketPdfUrl
                  : undefined,
              ticketImageUrl:
                typeof (apiData as { ticketImageUrl?: unknown })
                  ?.ticketImageUrl === "string"
                  ? (apiData as { ticketImageUrl: string }).ticketImageUrl
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
    if (!sessionId) return;

    didAutoVerifyRef.current = true;
    const timeoutId = window.setTimeout(() => {
      void verifyBooking();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [sessionId, verifyBooking]);

  const statusBadge =
    state.status === "success"
      ? "Confirmed"
      : state.status === "loading"
      ? "Confirming"
      : state.status === "error"
      ? "Failed"
      : "Pending";

  const title =
    state.status === "success"
      ? "Booking confirmed"
      : state.status === "loading"
      ? "Confirming your booking"
      : state.status === "error"
      ? "We couldn't confirm your booking"
      : "Payment received";

  const description =
    state.status === "success"
      ? "Your payment is complete. Your ticket will be available here."
      : state.status === "loading"
      ? "This can take a few seconds. Please don’t close this page."
      : state.status === "error"
      ? "If the payment succeeded, you can retry confirmation or check your bookings."
      : "We’re preparing your ticket.";

  const iconStyles =
    state.status === "success"
      ? "bg-primary/10 text-green-500"
      : state.status === "error"
      ? "bg-destructive/10 text-destructive"
      : "bg-muted text-foreground";

  const icon =
    state.status === "success" ? "✓" : state.status === "error" ? "×" : "…";

  const primaryActionLabel = ticketUrl
    ? "View ticket"
    : ticketPdfUrl
    ? "Download ticket"
    : "Go to bookings";

  const onPrimaryAction = () => {
    if (ticketUrl) {
      window.open(ticketUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (ticketPdfUrl) {
      window.open(ticketPdfUrl, "_blank", "noopener,noreferrer");
      return;
    }
    router.push("/bookings");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-center justify-center text-center">
          <div className="flex flex-col items-center">
            <div
              className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${iconStyles}`}
              aria-hidden="true"
            >
              <span className="text-3xl font-semibold leading-none">
                {icon}
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
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm">
              <div className="font-medium text-destructive">
                Common reasons for confirmation failure:
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-destructive">
                <li>Payment is still processing</li>
                <li>Network connectivity issues</li>
                <li>Your session expired</li>
                <li>The booking was already confirmed</li>
              </ul>
              <div className="mt-3 text-destructive">{state.message}</div>
            </div>
          ) : (
            <div className="rounded-md border bg-muted/30 p-4 text-sm">
              <div className="font-medium">Next steps</div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
                <li>Open your bookings to see the ticket</li>
                <li>Use “View ticket” when it becomes available</li>
                <li>Download a PDF copy when ready</li>
              </ul>
            </div>
          )}

          {state.status === "success" && (ticketImageUrl || ticketPdfUrl) ? (
            <div className="text-sm text-muted-foreground">
              Ticket is ready. Use the buttons below.
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full gap-2">
            <Button
              type="button"
              className="flex-1"
              variant="destructive"
              onClick={onPrimaryAction}
              disabled={state.status === "loading"}
            >
              {state.status === "loading" ? "Confirming…" : primaryActionLabel}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() =>
                state.status === "error"
                  ? void verifyBooking()
                  : router.push("/")
              }
              disabled={!sessionId || state.status === "loading"}
            >
              {state.status === "error" ? "Try again" : "Back to Home"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Need help?{" "}
            <a
              className="text-primary underline underline-offset-4"
              href="mailto:hello@greatevents.com"
            >
              Contact Support
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
