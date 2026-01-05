import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  Music2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

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

async function getBaseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) throw new Error("Missing host");
  return `${proto}://${host}`;
}

async function fetchEvent(id: string): Promise<EventDetail | null> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/events/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data as EventDetail;
}

const formatDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatPrice = (priceCents: number | null) => {
  if (!priceCents || priceCents <= 0) return "Free Entry";
  return `$${(priceCents / 100).toFixed(2)}`;
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await fetchEvent(id);
  if (!event) {
    notFound();
  }

  return (
    <main className="bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
        {event.thumbnailUrl && (
          <Image
            src={event.thumbnailUrl}
            alt={event.title}
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="relative container mx-auto px-4 py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-rose-200">
                <span className="flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-rose-100">
                  <Music2 className="h-4 w-4" />
                  {event.category}
                </span>
                <span className="text-rose-300">{event.status}</span>
              </div>
              <h1 className="text-4xl font-black leading-tight md:text-5xl">
                {event.title}
              </h1>
              <p className="text-white/70 max-w-2xl">
                {event.description ||
                  "Join us for an unforgettable experience crafted for true fans. Reserve your seats and get ready for a night to remember."}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-[0.3em]">
                    <CalendarDays className="h-4 w-4" />
                    Date
                  </div>
                  <p className="mt-2 text-lg font-semibold">
                    {formatDate(event.date)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-[0.3em]">
                    <Clock3 className="h-4 w-4" />
                    Time
                  </div>
                  <p className="mt-2 text-lg font-semibold">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Venue
                  </p>
                  <div className="mt-3 flex items-start gap-3 text-white">
                    <MapPin className="h-5 w-5 text-rose-300" />
                    <div>
                      <p className="text-lg font-semibold">
                        {event.cinema.name}
                      </p>
                      <p className="text-sm text-white/60">
                        {event.cinema.location || "Great Events Center"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Ticket Price
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {formatPrice(event.priceCents)}
                  </p>
                  {event.capacity && (
                    <p className="text-sm text-white/60 mt-2">
                      Capacity: {event.capacity} seats
                    </p>
                  )}
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl"
                >
                  <Link href={`/events/${event.id}/checkout`}>
                    <Ticket className="mr-2 h-5 w-5" />
                    Buy Tickets
                  </Link>
                </Button>
                <p className="text-xs text-white/60">
                  Secure checkout powered by Stripe. Tickets arrive instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
