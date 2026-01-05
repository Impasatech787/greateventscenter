"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type EventRecord = {
  id: number;
  title: string;
  cinemaId: number;
  cinemaName: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  status: string;
  capacity: number | null;
  priceCents: number | null;
  description?: string | null;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { data, loading, error, call } = useApi<EventRecord[]>();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("authToken") || "";
      await call("/api/admin/events", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    };

    fetchEvents();
  }, [call]);

  useEffect(() => {
    if (data) {
      setEvents(data);
    }
  }, [data]);

  const handleDelete = async (eventId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) return;
    setDeleteError(null);
    try {
      const token = localStorage.getItem("authToken") || "";
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }

      setEvents((prev) => prev.filter((eventItem) => eventItem.id !== eventId));
    } catch (deleteErr) {
      setDeleteError(
        deleteErr instanceof Error ? deleteErr.message : "Failed to delete event."
      );
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500">
            Review all events created for your venues.
          </p>
        </div>
        <Button asChild>
          <Link href="/back_office/dashboard/events/add">Add Event</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-500">
            Total events created: {events.length}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">
                    Loading events...
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">
                    No events yet. Click "Add Event" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((eventItem) => (
                  <TableRow key={eventItem.id}>
                    <TableCell className="font-medium">
                      {eventItem.title}
                    </TableCell>
                    <TableCell>{eventItem.cinemaName}</TableCell>
                    <TableCell>{eventItem.date}</TableCell>
                    <TableCell>
                      {eventItem.startTime} - {eventItem.endTime}
                    </TableCell>
                    <TableCell>{eventItem.category}</TableCell>
                    <TableCell>{eventItem.status}</TableCell>
                    <TableCell>{eventItem.capacity ?? 0}</TableCell>
                    <TableCell>
                      {(eventItem.priceCents ?? 0) > 0
                        ? `$${((eventItem.priceCents ?? 0) / 100).toFixed(2)}`
                        : "Free"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          asChild
                          title="Edit event"
                        >
                          <Link
                            href={`/back_office/dashboard/events/add?id=${eventItem.id}`}
                          >
                            <Edit className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Delete event"
                          onClick={() => handleDelete(eventItem.id)}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
