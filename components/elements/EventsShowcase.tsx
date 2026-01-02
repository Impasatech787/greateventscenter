"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PublicEvent = {
  id: number;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  priceCents: number | null;
  thumbnailUrl?: string | null;
  cinema: {
    name: string;
    location?: string | null;
  };
};

interface EventsShowcaseProps {
  title?: string;
  subtitle?: string;
  events: PublicEvent[];
}

const formatPrice = (priceCents: number | null) => {
  if (!priceCents || priceCents <= 0) return "Free";
  return `$${(priceCents / 100).toFixed(2)}`;
};

const formatDate = (date: string, startTime: string, endTime: string) => {
  const displayDate = new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );
  return `${displayDate} • ${startTime} - ${endTime}`;
};

export default function EventsShowcase({
  title = "Events & Concerts",
  subtitle = "Discover live experiences happening at our venues.",
  events,
}: EventsShowcaseProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-500 text-sm">{subtitle}</p>
          </div>
          <Link
            href="/events"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            View all events
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
            No upcoming events are available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative h-44 w-full bg-gray-100">
                  {event.thumbnailUrl ? (
                    <Image
                      src={event.thumbnailUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      No image
                    </div>
                  )}
                  <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900">
                    {formatPrice(event.priceCents)}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-600 uppercase">
                    {event.category}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(event.date, event.startTime, event.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {event.cinema.name}
                      {event.cinema.location ? ` • ${event.cinema.location}` : ""}
                    </span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/events/${event.id}`}>
                      <Ticket className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
