"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import apiClient from "@/lib/axios";
import { ApiError } from "@/types/ApiError";
import { ApiResponse } from "@/types/apiResponse";

type BookingDetails = {
  id: number;
  showId: number;
  status: string;
  createdAt: string | Date;
  reservedAt: string | Date;
  expiresAt: string | Date | null;
  priceCents: number;
  invoiceId: number | null;
  paymentMethod: string | null;
  paymentReferenceId: string | null;
  user: {
    id: number;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  } | null;
  show: {
    id: number;
    startAt: string | Date;
    movie: {
      id: number;
      title: string;
      durationMin: number | null;
      genres: string | null;
      rating: string | null;
    } | null;
    auditorium: {
      id: number;
      name: string;
      cinema: {
        id: number;
        name: string;
        location: string | null;
      };
    };
  } | null;
  seats: Array<{
    id: number;
    seatId: number | null;
    name: string;
    type: string | null;
  }>;
};

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status: string) {
  const s = status?.toUpperCase?.() ?? "";
  if (s === "BOOKED") return "bg-green-600 hover:bg-green-600 text-white";
  if (s === "INITIATED") return "bg-blue-600 hover:bg-blue-600 text-white";
  if (s === "CANCELLED") return "bg-red-600 hover:bg-red-600 text-white";
  if (s === "EXPIRED") return "bg-zinc-500 hover:bg-zinc-500 text-white";
  return "bg-zinc-700 hover:bg-zinc-700 text-white";
}

export default function BookingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const bookingId = useMemo(() => {
    const raw = params?.id;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const fetchBooking = async () => {
    if (!bookingId) {
      setError("Invalid booking id");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<ApiResponse<BookingDetails>>(
        `//admin/bookings/${bookingId}`,
      );

      setBooking(res.data.data);
    } catch (e) {
      setBooking(null);
      setError(e instanceof ApiError ? e.message : "Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const downloadTicket = async () => {
    if (!bookingId) return;
    setDownloading(true);
    try {
      const res = await apiClient.get(
        `/bookings/download-ticket/${bookingId}`,
        { responseType: "blob" },
      );

      const blob = (await res.data) as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to download ticket");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Booking Details</h1>
          <p className="text-gray-500 text-sm">
            View booking information, seats, and ticket actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/back_office/bookings")}
            className="border-gray-300"
          >
            Back
          </Button>
          <Button
            onClick={downloadTicket}
            disabled={downloading || !bookingId}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {downloading ? "Downloading..." : "Download Ticket"}
          </Button>
          <Button
            onClick={fetchBooking}
            disabled={loading || !bookingId}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>Booking #{bookingId ?? "-"}</span>
            {booking?.status ? (
              <Badge className={statusBadgeClass(booking.status)}>
                {booking.status}
              </Badge>
            ) : null}
          </CardTitle>
          <CardDescription>
            {booking?.show?.movie?.title
              ? `Movie: ${booking.show.movie.title}`
              : "Loading booking details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : !booking ? (
            <div className="text-sm text-gray-500">No booking found.</div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatMoney(booking.priceCents)}
                  </div>
                </div>
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-gray-500">Show Time</div>
                  <div className="text-sm font-semibold text-gray-900 mt-1">
                    {formatDateTime(booking.show?.startAt)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Show #{booking.showId}
                  </div>
                </div>
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-gray-500">Seats</div>
                  <div className="text-sm font-semibold text-gray-900 mt-1">
                    {booking.seats.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {booking.seats
                      .slice(0, 4)
                      .map((s) => s.name)
                      .join(", ")}
                    {booking.seats.length > 4 ? " ..." : ""}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <div className="text-sm font-semibold text-gray-900 mb-3">
                    Customer
                  </div>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium text-gray-900">
                        {`${booking.user?.firstName ?? ""} ${
                          booking.user?.lastName ?? ""
                        }`.trim() || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium text-gray-900">
                        {booking.user?.email ?? "-"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">User ID</span>
                      <span className="font-medium text-gray-900">
                        {booking.user?.id ?? "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-sm font-semibold text-gray-900 mb-3">
                    Venue
                  </div>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Cinema</span>
                      <span className="font-medium text-gray-900">
                        {booking.show?.auditorium?.cinema?.name ?? "-"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Auditorium</span>
                      <span className="font-medium text-gray-900">
                        {booking.show?.auditorium?.name ?? "-"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Location</span>
                      <span className="font-medium text-gray-900 text-right">
                        {booking.show?.auditorium?.cinema?.location ?? "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-sm font-semibold text-gray-900 mb-3">
                  Payment & Timing
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="font-medium text-gray-900">
                      {booking.paymentMethod ?? "-"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Invoice ID</span>
                    <span className="font-medium text-gray-900">
                      {booking.invoiceId ?? "-"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Created At</span>
                    <span className="font-medium text-gray-900">
                      {formatDateTime(booking.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Reserved At</span>
                    <span className="font-medium text-gray-900">
                      {formatDateTime(booking.reservedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Expires At</span>
                    <span className="font-medium text-gray-900">
                      {formatDateTime(booking.expiresAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-sm font-semibold text-gray-900 mb-3">
                  Seats
                </div>
                <div className="grid gap-2">
                  {booking.seats.length === 0 ? (
                    <div className="text-sm text-gray-500">No seats.</div>
                  ) : (
                    <div className="grid gap-2 md:grid-cols-2">
                      {booking.seats.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between rounded-lg border bg-white px-3 py-2"
                        >
                          <div className="text-sm font-medium text-gray-900">
                            {s.name}
                          </div>
                          <Badge
                            variant="outline"
                            className="border-red-200 text-red-600"
                          >
                            {s.type ?? "-"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
