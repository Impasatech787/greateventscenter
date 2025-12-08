import MovieLists from "@/components/elements/MovieLists";
import MoviePageBanner from "@/components/elements/MoviePageBanner";

export default async function MoviePage() {
  return (
    <main>
      <MoviePageBanner />
      <MovieLists />
    </main>
  );
}
