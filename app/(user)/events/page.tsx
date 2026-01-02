import { headers } from "next/headers";
import EventsShowcase, {
  PublicEvent,
} from "@/components/elements/EventsShowcase";

async function getBaseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) throw new Error("Missing host");
  return `${proto}://${host}`;
}

async function fetchEvents() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/events?status=Scheduled`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data as PublicEvent[];
}

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <main>
      <div className="bg-gray-900 text-white py-16">
        <div className="container px-4">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-300">
            Events & Concerts
          </p>
          <h1 className="text-4xl font-bold mt-3">Live the Moment</h1>
          <p className="text-gray-300 mt-3 max-w-2xl">
            Browse upcoming events, book tickets instantly, and make memories at
            Great Events Center.
          </p>
        </div>
      </div>
      <EventsShowcase
        title="Upcoming Events"
        subtitle="Plan your next night out with curated concerts and showcases."
        events={events}
      />
    </main>
  );
}
