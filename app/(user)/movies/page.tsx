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

async function fetchNowShowings() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/movies/now-showing`,
  );
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
