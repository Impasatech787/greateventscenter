import { notFound } from "next/navigation";
import {
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
import { Button } from "@/components/ui/button";
import ShowtimeCalendarPicker, {
  Showtime,
} from "@/components/elements/ShowtimeCalendarPicker";
import { movie as Movie, show as Show } from "@/app/generated/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}
async function fetchMovie(
  slug: string
): Promise<(Movie & { shows: Show[] }) | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/movies/${slug}`
  );
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data.data;
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const movie: (Movie & { shows: Show[] }) | null = await fetchMovie(slug);
  if (!movie) {
    notFound();
  }
  const formatShowTimes = () => {
    const showsByDate: { [key: string]: Show[] } = {};
    movie.shows.forEach((show) => {
      const showDate = new Date(show.startAt);
      const dateKey = showDate.toDateString();
      if (!showsByDate[dateKey]) {
        showsByDate[dateKey] = [];
      }
      showsByDate[dateKey].push(show);
    });

    const formattedShowtimes: Showtime[] = Object.keys(showsByDate).map(
      (dateKey) => {
        const shows = showsByDate[dateKey];
        const showDate = new Date(shows[0].startAt);

        const labelOptions: Intl.DateTimeFormatOptions = {
          weekday: "short",
          month: "short",
          day: "numeric",
        };

        let label = showDate.toLocaleDateString("en-US", { weekday: "short" });
        if (showDate.toDateString() === new Date().toDateString()) {
          label = "Today";
        } else {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (showDate.toDateString() === tomorrow.toDateString()) {
            label = "Tomorrow";
          }
        }

        const date = showDate.toLocaleDateString("en-US", labelOptions);

        const times = shows.map((show) => {
          const showTime = new Date(show.startAt);
          return {
            id: show.id,
            time: showTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
          };
        });
        console.log(times);

        return {
          label,
          date,
          format: "IMAX with Laser · Reserved Seating",
          premiumTag: "Most popular",
          theater: "Great Events Cinemas · Downtown",
          times,
        };
      }
    );

    return formattedShowtimes;
  };

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section - Static */}
      <section className="relative min-h-[100svh] sm:min-h-[85vh] lg:min-h-[80vh] overflow-hidden">
        <Image
          src={movie.posterUrl || ""}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top sm:object-center"
          sizes="100vw"
        />
        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30 sm:from-black/90 sm:via-black/60 lg:via-black/50 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 min-h-[100svh] sm:min-h-[85vh] lg:min-h-[80vh] flex flex-col justify-end pb-8 sm:pb-12 lg:pb-16">
          <div className="w-full flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
            {/* Left content */}
            <div className="flex-1 max-w-3xl pt-20 sm:pt-24">
              {/* Status badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <span className="inline-flex items-center bg-[#BB2327] text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md uppercase tracking-widest shadow-lg shadow-red-900/30">
                  Now Showing
                  {/* {movie.status === "NOW SHOWING" */}
                  {/*   ? "Now Showing" */}
                  {/*   : "Coming Soon"} */}
                </span>
                <span className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/70 border-l border-white/20 pl-2.5 sm:pl-3">
                  {movie.genres}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.9] drop-shadow-2xl">
                {movie.title}
              </h1>

              {/* Tagline */}
              <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-xl lg:max-w-2xl mt-3 sm:mt-4 leading-relaxed">
                {/* {movie.tagline} */}
              </p>

              {/* Meta info pills */}
              <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-5 text-xs sm:text-sm text-white/90">
                <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <Clock3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" />
                  {movie.durationMin} MIN
                </span>
                <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" />
                  {/* {new Date(movie.releaseDate).toISOString()} */}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <Clapperboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" />
                  {movie.rating}
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
                <Button
                  asChild
                  size="lg"
                  className="flex-1 bg-red-700 text-white hover:bg-red-600 font-bold rounded-xl px-6 sm:px-8 
               min-h-14 sm:min-h-16          
               text-base sm:text-lg           
               shadow-xl shadow-red-700/30 
               transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl 
               flex items-center justify-center"
                >
                  <Link
                    href="#showtimes"
                    className="flex items-center justify-center w-full h-full"
                  >
                    <Ticket className="w-5 h-5 mr-2.5" />
                    Book Tickets
                  </Link>
                </Button>

                <Button
                  size="lg"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md 
               border border-white/20 font-semibold rounded-xl px-6 sm:px-8 
               min-h-14 sm:min-h-16    
               text-base sm:text-lg 
               shadow-lg 
               transition-all duration-300 hover:scale-[1.02] 
               flex items-center justify-center"
                >
                  <Film className="w-5 h-5 mr-2.5" />
                  Watch Trailer
                </Button>
              </div>

              {/* Highlights tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-5 sm:mt-6">
                {/* {movie.highlights.map((highlight) => ( */}
                {/*   <span */}
                {/*     key={highlight} */}
                {/*     className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/70 font-medium" */}
                {/*   > */}
                {/*     {highlight} */}
                {/*   </span> */}
                {/* ))} */}
              </div>
            </div>

            {/* Right poster - visible on medium screens and up */}
            <div className="hidden md:block flex-shrink-0 self-end mb-0 lg:mb-4">
              <div className="relative w-[180px] lg:w-[220px] xl:w-[260px] hover:scale-[1.03] transition-all duration-500 group cursor-pointer">
                {/* Main poster card */}
                <div className="relative aspect-[2/3] rounded-xl lg:rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/60 ring-1 ring-white/5">
                  <Image
                    src={movie.posterUrl || ""}
                    alt={`${movie.title} poster`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 180px, (max-width: 1280px) 220px, 260px"
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  {/* Bottom vignette */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                      <Film className="w-5 h-5 lg:w-6 lg:h-6 text-black ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator - mobile only */}
          <div className="flex justify-center mt-6 sm:hidden animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
              <div className="w-1 h-2.5 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Showtimes Section */}
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

          {/* Calendar picker with time selection and seat accordion */}
          <div className="mt-8">
            <ShowtimeCalendarPicker
              movieTitle={movie.title}
              showtimes={formatShowTimes()}
            />
          </div>
        </div>
      </section>

      {/* About Section - Static */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-xl font-semibold mb-3">About the film</h3>
            <p className="text-slate-100/90 leading-relaxed">
              {movie.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200/80">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10">
                <Sparkles className="w-4 h-4" />
                {movie.genres}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10">
                <Popcorn className="w-4 h-4" />
                {movie.rating} · {movie.durationMin} Min
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">Cast & crew</h3>
            <div className="grid grid-cols-1 gap-3">
              {movie.casts}
              {/* {movie.cast.map((person) => ( */}
              {/*   <div */}
              {/*     key={`${person.name}-${person.role}`} */}
              {/*     className="flex items-center justify-between border-b border-white/5 pb-3 last:border-none last:pb-0" */}
              {/*   > */}
              {/*     <div> */}
              {/*       <p className="font-semibold">{person.name}</p> */}
              {/*       <p className="text-sm text-slate-200/80">{person.role}</p> */}
              {/*     </div> */}
              {/*     <div className="text-xs text-emerald-200 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30"> */}
              {/*       {movie.title.slice(0, 1).toUpperCase()} */}
              {/*     </div> */}
              {/*   </div> */}
              {/* ))} */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// export async function generateStaticParams() {
//   return MOVIES.map((movie) => ({ slug: movie.slug }));
// }
