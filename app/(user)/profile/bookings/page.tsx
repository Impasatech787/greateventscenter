"use client";

import { BookingStatus } from "@/app/generated/prisma";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";

interface BookSeat {
  name: string;
  seatType: string;
}

interface Booking {
  id: number;
  movieTitle: string;
  moviePosterUrl: string;
  startAt: string;
  reservedAt?: string;
  quantity: number;
  totalPrice: number;
  seats: BookSeat[];
  status: BookingStatus;
}

function formatDT(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(n: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD", // change to your currency
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n}`;
  }
}

function SeatChip({ seat }: { seat: BookSeat }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">
      <span className="font-medium">{seat.name}</span>
      <span className="text-gray-500">•</span>
      <span className="text-gray-600">{seat.seatType}</span>
    </span>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const reserved = booking.reservedAt;
  const downloadTicket = async (bookingId: number) => {
    setIsDownloading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/bookings/download-ticket/${bookingId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to download ticket (${res.status})`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `booking-${bookingId}-ticket.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download ticket error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex gap-4">
          {/* Poster */}
          <div className="shrink-0">
            <div className="h-28 w-20 sm:h-32 sm:w-24 overflow-hidden rounded-xl bg-gray-100 border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={booking.moviePosterUrl}
                alt={booking.movieTitle}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-base sm:text-lg font-semibold text-gray-900">
                  {booking.movieTitle}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Show starts:{" "}
                  <span className="font-medium">
                    {formatDT(booking.startAt)}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Reserved:{" "}
                  <span className="font-medium">{formatDT(reserved)}</span>
                </p>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-gray-50 border p-3">
                <p className="text-xs text-gray-500 text-center">
                  Ticket Quantity
                </p>
                <p className="text-sm text-center font-semibold text-gray-900">
                  {booking.quantity}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 border p-3">
                <p className="text-xs text-gray-500 text-center">
                  Total Amount
                </p>
                <p className="text-sm font-semibold text-gray-900 text-center">
                  {formatMoney(booking.totalPrice / 100)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 border p-3 col-span-2 sm:col-span-2">
                <p className="text-xs text-gray-500 text-center">Seats</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {booking.seats?.length ? (
                    booking.seats.map((s, idx) => (
                      <SeatChip key={`${s.name}-${idx}`} seat={s} />
                    ))
                  ) : (
                    <span className="text-sm text-gray-600">—</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              {booking.status != BookingStatus.BOOKED && (
                <div
                  className={` rounded-xl bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600`}
                >
                  Failed
                </div>
              )}
              {booking.status == BookingStatus.BOOKED && (
                <button
                  type="button"
                  disabled={isDownloading}
                  className={
                    `rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700` +
                    (isDownloading ? " opacity-50 cursor-not-allowed" : "")
                  }
                  onClick={() => {
                    downloadTicket(booking.id);
                  }}
                >
                  {isDownloading ? "Downloading..." : "Download Ticket"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyBookings() {
  const [bookingLists, setBookingLists] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalSpent = useMemo(
    () => bookingLists.reduce((sum, b) => sum + (b.totalPrice || 0) / 100, 0),
    [bookingLists],
  );

  useEffect(() => {
    let alive = true;

    const fetchBookings = async () => {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No auth token found. Please login again.");

        const res = await fetch("/api/bookings", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to get bookings (${res.status})`);
        }

        const json = await res.json();
        const bookings = json.data;

        if (alive) setBookingLists(bookings);
      } catch (err: unknown) {
        if (alive)
          setErrorMsg(
            err instanceof Error ? err.message : "Something went wrong",
          );
      } finally {
        if (alive) setIsLoading(false);
      }
    };

    fetchBookings();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="py-12 bg-white">
      <div className="container px-4">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h1 className="text-red-600 text-lg font-semibold">
                My Bookings
              </h1>
              <p className="text-sm text-gray-600">
                Manage your tickets and view seat details.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="rounded-2xl border bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-500">Bookings</p>
                <p className="text-sm font-semibold">{bookingLists.length}</p>
              </div>
              <div className="rounded-2xl border bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-500">Total spent</p>
                <p className="text-sm font-semibold">
                  {formatMoney(totalSpent)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* States */}
          {isLoading && (
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="h-28 w-20 rounded-xl bg-gray-100" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-2/3 bg-gray-100 rounded" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded" />
                      <div className="h-3 w-1/3 bg-gray-100 rounded" />
                      <div className="h-10 w-full bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && errorMsg && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              {errorMsg}
            </div>
          )}

          {!isLoading && !errorMsg && bookingLists.length === 0 && (
            <div className="rounded-2xl border bg-gray-50 p-6 text-gray-700">
              <p className="font-medium">No bookings found</p>
              <p className="text-sm text-gray-600 mt-1">
                Once you book a ticket, it will appear here.
              </p>
            </div>
          )}

          {/* List */}
          {!isLoading && !errorMsg && bookingLists.length > 0 && (
            <div className="grid gap-4">
              {bookingLists.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
