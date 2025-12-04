import { Button } from "../ui/button";

const trustedCompanies = [
  "Omaha Steaks",
  "Union Pacific",
  "Kiewit",
  "Mutual of Omaha",
  "First National",
];

const HomeBanner = () => {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)),url(/GreatEventsBanner.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Main Content */}
      <div className="text-white flex flex-col gap-6 items-center justify-center px-4 flex-1 pt-20">
        <h1 className="text-5xl mt-4 md:mt-0 md:text-6xl lg:text-7xl font-bold max-w-4xl text-center leading-tight">
          Book Your Hall Instantly
          <br />
          With Real-Time Availability
        </h1>
        <p className="text-gray-200/90 text-base md:text-lg max-w-2xl text-center leading-relaxed">
          Experience hassle-free venue booking with transparent pricing, instant
          confirmation, and flexible packages for events of all sizes.
        </p>
        <div className="flex gap-4 mt-2">
          <Button className="bg-red-600 hover:bg-red-700 px-8 py-6 text-base font-medium rounded-full">
            Book Hall
          </Button>
          <Button
            variant="outline"
            className="bg-transparent hover:bg-white/10 text-white border-white/80 px-8 py-6 text-base font-medium rounded-full"
          >
            Inquiry
          </Button>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="w-full pb-8 pt-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Divider Line */}
          <div className="w-full h-px bg-white/20 mb-8"></div>

          <div className="flex flex-col items-center gap-6">
            <p className="text-white/60 text-xs uppercase tracking-widest font-medium">
              Trusted by Omaha&apos;s Best
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
              {trustedCompanies.map((company) => (
                <span
                  key={company}
                  className="text-white/80 text-sm md:text-base font-medium tracking-wide"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
