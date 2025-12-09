import { MOVIES } from "@/app/data/movies";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  CalendarDays,
  Clapperboard,
  Clock3,
  Film,
  MapPin,
  Popcorn,
  Sparkles,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShowtimeCalendarPicker from "@/components/elements/ShowtimeCalendarPicker";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = MOVIES.find((item) => item.slug === slug);

  if (!movie) {
    notFound();
  }

  const today = new Date();
  const baseTimes =
    movie.showtimes[0]?.times ?? ["12:00 PM", "3:00 PM", "6:30 PM"];
  const weeklyCalendar = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index + 3); // start after the "weekend" block
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.toLocaleDateString("en-US", { day: "numeric" });
    return {
      label: `${weekday}, ${month} ${day}`,
      times: baseTimes.slice(0, 3),
      weekday,
      month,
      day,
    };
  });

  const todayISO = today.toISOString().split("T")[0];
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 29);
  const maxISO = maxDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative min-h-[75vh] overflow-hidden">
        <Image
          src={movie.heroImage || movie.image}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center bg-[#BB2327] text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-widest shadow-lg">
              {movie.status === "NOW SHOWING" ? "Now Showing" : "Coming Soon"}
            </span>
            <span className="text-sm uppercase tracking-[0.3em] text-rose-100/80 border-l border-white/30 pl-3">
              {movie.genre}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] drop-shadow-2xl">
            {movie.title}
          </h1>
          <p className="text-lg sm:text-xl text-slate-100/90 max-w-3xl mt-4 leading-relaxed">
            {movie.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6 text-sm text-slate-100/90">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10">
              <Clock3 className="w-4 h-4" />
              {movie.duration}
            </span>
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10">
              <CalendarDays className="w-4 h-4" />
              {movie.releaseDate}
            </span>
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10">
              <Clapperboard className="w-4 h-4" />
              {movie.rating}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <Button
              asChild
              className="bg-white text-black hover:bg-zinc-200 font-bold rounded-lg px-8 h-14 text-lg shadow-lg transition-all hover:scale-105 border border-white/50"
            >
              <Link href="#showtimes">Book Tickets</Link>
            </Button>
            <Button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-bold rounded-lg px-8 h-14 text-lg shadow-lg transition-all hover:scale-105">
              <Ticket className="w-4 h-4" />
              Add to Watchlist
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-8">
            {movie.highlights.map((highlight) => (
              <span
                key={highlight}
                className="px-3 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-slate-100/90"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden md:block absolute right-10 bottom-8 w-[240px]">
          <div className="relative aspect-[2/3] rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-red-500/25 ring-1 ring-white/10">
            <Image
              src={movie.posterImage || movie.image}
              alt={`${movie.title} poster`}
              fill
              className="object-cover"
              sizes="240px"
            />
          </div>
        </div>
      </section>

      <section
        id="showtimes"
        className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#1f0b0f] via-slate-950 to-black"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(248,113,113,0.2),transparent_30%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase text-rose-200/80 tracking-[0.2em]">
                Choose your moment
              </p>
              <h2 className="text-3xl font-semibold">Showtimes</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <MapPin className="w-4 h-4" />
              Great Events Cinemas · Multiple locations
            </div>
          </div>

          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {movie.showtimes.map((slot) => {
              const [weekdayRaw, rest] = slot.date.split(",");
              const weekday = weekdayRaw?.trim() ?? "";
              const month = rest?.trim().split(" ")[0] ?? "";
              const day = rest?.trim().split(" ")[1] ?? "";

              return (
                <div
                  key={`${slot.label}-calendar-${slot.date}`}
                  className="min-w-[150px] rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur shadow-lg shadow-red-500/15"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-rose-100">
                    <span>{slot.label}</span>
                    {slot.premiumTag && (
                      <Sparkles className="w-3 h-3 text-rose-100" />
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div className="text-4xl font-bold leading-none">
                      {day || "—"}
                    </div>
                    <div className="flex flex-col text-sm text-slate-200">
                      <span className="uppercase tracking-[0.2em]">
                        {month || "Date"}
                      </span>
                      <span className="text-emerald-200/80">{weekday}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-200/80">
                    {slot.format}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <ShowtimeCalendarPicker
              baseTimes={baseTimes}
              minDate={todayISO}
              maxDate={maxISO}
            />
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">
                Plan next week
              </h3>
              <span className="text-xs uppercase tracking-[0.2em] text-rose-200/80">
                More dates, same perks
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {weeklyCalendar.map((slot) => (
                <div
                  key={`week-${slot.label}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur shadow-lg shadow-red-500/10"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-rose-100">
                    <span>{slot.weekday}</span>
                    <Sparkles className="w-3 h-3 text-rose-200" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <div className="text-3xl font-bold leading-none">
                      {slot.day}
                    </div>
                    <div className="flex flex-col text-xs text-slate-200">
                      <span className="uppercase tracking-[0.2em]">
                        {slot.month}
                      </span>
                      <span className="text-rose-200/80">Next week</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {slot.times.map((time) => (
                      <Button
                        key={`${slot.label}-${time}`}
                        variant="outline"
                        className="border-red-400/40 text-white hover:border-red-300 hover:text-red-100 bg-white/5"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-xl font-semibold mb-3">About the film</h3>
            <p className="text-slate-100/90 leading-relaxed">{movie.synopsis}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200/80">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10">
                <Sparkles className="w-4 h-4" />
                {movie.genre}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10">
                <Popcorn className="w-4 h-4" />
                {movie.rating} · {movie.duration}
              </span>
            </div>
          </div>


        </div>

        <div className="space-y-4">


          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">Cast & crew</h3>
            <div className="grid grid-cols-1 gap-3">
              {movie.cast.map((person) => (
                <div
                  key={`${person.name}-${person.role}`}
                  className="flex items-center justify-between border-b border-white/5 pb-3 last:border-none last:pb-0"
                >
                  <div>
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-sm text-slate-200/80">{person.role}</p>
                  </div>
                  <div className="text-xs text-emerald-200 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    {movie.title.slice(0, 1).toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return MOVIES.map((movie) => ({ slug: movie.slug }));
}
