import { headers } from "next/headers";
import MovieLists from "@/components/elements/MovieLists";
import MoviePageBanner from "@/components/elements/MoviePageBanner";
export interface Movie {
  id: number;
  slug: string;
  title: string;
  durationMin: number;
  language: string;
  posterUrl: string;
  genres: string;
}

async function getBaseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) throw new Error("Missing host");
  return `${proto}://${host}`;
}

async function fetchNowShowings() {
  const baseUrl = await getBaseUrl();
  console.log(baseUrl);
  const res = await fetch(`${baseUrl}/api/movies/now-showing`);

  if (!res.ok) throw new Error("Failed To fetch Movies");
  const data = await res.json();
  return data.data;
}

export default async function MoviePage() {
  const movies: Movie[] = await fetchNowShowings();

  return (
    <main>
      <MoviePageBanner />
      <MovieLists movies={movies} />
    </main>
  );
}
