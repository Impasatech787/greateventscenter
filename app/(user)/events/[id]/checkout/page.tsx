"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

type EventDetail = {
  id: number;
  title: string;
  category: string;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  priceCents: number | null;
  thumbnailUrl?: string | null;
  description?: string | null;
  cinema: {
    id: number;
    name: string;
    location?: string | null;
  };
};

const formatDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function EventCheckoutPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/events/${params.id}`);
      if (!res.ok) {
        setError("Event not found.");
        return;
      }
      const payload = await res.json();
      setEvent(payload.data as EventDetail);
    };
    fetchEvent();
  }, [params.id]);

  const totalPrice = useMemo(() => {
    if (!event?.priceCents) return 0;
    return event.priceCents * quantity;
  }, [event, quantity]);

  const handleCheckout = async () => {
    if (!event) return;
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/events/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event.id,
          quantity,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to create booking.");
      }

      const payload = await response.json();
      const checkoutUrl = payload.data?.checkoutUrl as string | undefined;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
      throw new Error("Checkout URL missing.");
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Failed to start checkout."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) {
    return (
      <main className="container px-4 py-16">
        <p className="text-gray-600">{error ?? "Loading event..."}</p>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="container px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Checkout
            </p>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          </div>
          <Button variant="secondary" asChild>
            <Link href={`/events/${event.id}`}>Back to event</Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <CalendarDays className="h-5 w-5" />
                <span>
                  {formatDate(event.date)} • {event.startTime} - {event.endTime}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>
                  {event.cinema.name}
                  {event.cinema.location ? ` • ${event.cinema.location}` : ""}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {event.description ||
                  "Complete your purchase to secure your spot at this event."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Tickets
              </p>
              <div className="mt-3 flex items-center gap-4">
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-24"
                />
                <p className="text-sm text-gray-600">
                  Price per ticket:{" "}
                  {event.priceCents
                    ? `$${(event.priceCents / 100).toFixed(2)}`
                    : "Free"}
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Total</span>
                <span className="text-lg font-semibold text-gray-900">
                  {event.priceCents
                    ? `$${(totalPrice / 100).toFixed(2)}`
                    : "Free"}
                </span>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              size="lg"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              onClick={handleCheckout}
              disabled={isSubmitting}
            >
              <Ticket className="mr-2 h-5 w-5" />
              Buy Tickets
            </Button>
            <p className="text-xs text-gray-500">
              By continuing, you agree to our ticketing terms.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
