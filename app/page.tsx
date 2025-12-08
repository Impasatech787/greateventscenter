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
      <div className="max-w-7xl mx-auto flex flex-col gap-4 pt-12 pb-2 px-4 lg:px-0">
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
