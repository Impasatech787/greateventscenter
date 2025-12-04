import HomeBanner from "@/components/elements/HomeBanner";
import OurServices from "../components/elements/OurServices";
import HomeCTA from "@/components/elements/HomeCTA";
import MovieLists from "@/components/elements/MovieLists";
import Stats from "@/components/elements/Stats";
import AvailableVenues from "@/components/elements/AvailableVenues";
import AvailableHalls from "@/components/elements/AvailableHalls";

export default function Home() {
  return (
    <main>
      <HomeBanner />
      <Stats />
      <OurServices />
      <MovieLists />
      <AvailableHalls />
      <AvailableVenues />
      <HomeCTA />
    </main>
  );
}
