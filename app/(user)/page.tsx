import HomeBanner from "@/components/elements/HomeBanner";
import OurServices from "@/components/elements/OurServices";
import HomeCTA from "@/components/elements/HomeCTA";
import Stats from "@/components/elements/Stats";
import AvailableVenues from "@/components/elements/AvailableVenues";
import AvailableHalls from "@/components/elements/AvailableHalls";
import EventsShowcase, {
  PublicEvent,
} from "@/components/elements/EventsShowcase";
import { headers } from "next/headers";

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
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data as PublicEvent[];
}

export default async function Home() {
  const events = await fetchEvents();
  return (
    <main>
      <HomeBanner />
      <Stats />
      <OurServices />
      <EventsShowcase events={events.slice(0, 6)} />
      <div className="container flex flex-col gap-4 pt-12 pb-2 px-4 lg:px-0">
        <h2 className="text-3xl font-bold mb-0">Explore Our Spaces.</h2>
        <p className="text-gray-800">
          Choose from our elegant indoor halls or breathtaking outdoor venues.
        </p>
      </div>
      <AvailableHalls />
      <AvailableVenues />
      <HomeCTA />
    </main>
  );
}
