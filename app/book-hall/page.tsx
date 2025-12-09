"use client";
import { useState } from "react";
import { Users, Car, Volume2, Fan } from "lucide-react";
import { HALLS_DATA } from "../data/hall-data";
import { ImageWithFallback } from "@/components/elements/ImageWithFallback";
import { CardStack } from "@/components/elements/CardStack";
import { RotatingText } from "@/components/elements/RotatingText";

export default function BookHallPage() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const heroImageSets = [
    [
      "https://images.unsplash.com/photo-1758870041148-31d28fdf34d9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611555248913-e3bf90c57689?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1530103862676-de3c9a59aa38?auto=format&fit=crop&w=800&q=80",
    ],
    // Wedding
    [
      "https://images.unsplash.com/photo-1763553113332-800519753e40?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519657502999-ab785d28a1f6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    ],
    // Corporate
    [
      "https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1758691736975-9f7f643d178e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    ],
    // Festival
    [
      "https://images.unsplash.com/photo-1611810293387-c8afe03cd7dd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1763733593491-e81f18a116af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
    ],
  ];

  const heroImages = heroImageSets[currentTextIndex];

  const memoryImages = [
    "https://images.unsplash.com/photo-1758599670003-ccf2c2ade8e6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1712709975427-bd1c70c40691?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1739298061766-e2751d92e9db?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579792853146-f72810b1c731?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1710186012216-9b2cf2a800bf?auto=format&fit=crop&w=800&q=80",
  ];

  const eventCategories = [
    {
      title: "Social Events",
      description:
        "Weddings, receptions, birthday parties, and cultural celebrations.",
      image:
        "https://images.unsplash.com/photo-1764269719300-7094d6c00533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwcGFydHklMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjQzMjkzMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Community Gatherings",
      description:
        "Conduct community gatherings, festivals, and cultural shows.",
      image:
        "https://images.unsplash.com/photo-1759430711469-0cdbbc220dea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGZlc3RpdmFsJTIwY29tbXVuaXR5JTIwZ2F0aGVyaW5nfGVufDF8fHx8MTc2NDMyOTYwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Coworking & Office",
      description:
        "Coworking spaces or temporary office setups for startups or freelancers.",
      image:
        "https://images.unsplash.com/photo-1758711516684-e7a87556015e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZSUyMG1vZGVybiUyMG9mZmljZSUyMHN0YXJ0dXB8ZW58MXx8fHwxNzY0MzI5NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Exhibitions & Launches",
      description:
        "Use the halls for trade fairs, exhibitions, and product launches.",
      image:
        "https://images.unsplash.com/photo-1659122026394-e8f6c94d35a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkZSUyMGZhaXIlMjBleGhpYml0aW9uJTIwYm9vdGglMjBwcm9kdWN0JTIwbGF1bmNofGVufDF8fHx8MTc2NDMyOTYwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Corporate Meetings",
      description:
        "Rent out spaces for corporate training sessions or business meetings.",
      image:
        "https://images.unsplash.com/photo-1709803857154-d20ee16ff763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwYm9hcmQlMjByb29tJTIwYnVzaW5lc3MlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NjQzMjk2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Educational Programs",
      description:
        "Hold large classroom sessions, training programs, or educational camps.",
      image:
        "https://images.unsplash.com/photo-1758691736067-b309ee3ef7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBzZW1pbmFyJTIwdHJhaW5pbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzY0MzI5NjA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Fitness & Sports",
      description:
        "Conduct fitness classes, yoga sessions, or indoor sports activities.",
      image:
        "https://images.unsplash.com/photo-1602827114685-efbb2717da9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY2xhc3MlMjBmaXRuZXNzJTIwZ3JvdXAlMjBpbmRvb3IlMjBzcG9ydHN8ZW58MXx8fHwxNzY0MzI5NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Creative Workshops",
      description: "Organize art and craft workshops or hobby clubs.",
      image:
        "https://images.unsplash.com/photo-1759646828783-7e1b8f02f89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjB3b3Jrc2hvcCUyMGNyYWZ0JTIwY2xhc3MlMjBjcmVhdGl2ZSUyMGdyb3VwfGVufDF8fHx8MTc2NDMyOTYwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-[80px] overflow-x-hidden font-sans">
      {/* Custom Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slide-text {
          0%, 15% { transform: translateY(0); }
          20%, 35% { transform: translateY(-20%); }
          40%, 55% { transform: translateY(-40%); }
          60%, 75% { transform: translateY(-60%); }
          80%, 95% { transform: translateY(-80%); }
          100% { transform: translateY(-80%); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />

      {/* Hero Section */}
      <div className="max-w-[1260px] mx-auto px-6 pt-[120px] mb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left: Text Content */}
          <div className="w-full lg:w-1/2 text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 flex flex-col gap-2">
              <span className="text-[rgb(29,29,29)] font-[Manrope]">
                We have hall for
              </span>
              <RotatingText
                texts={["Birthday", "Wedding", "Corporate", "Festival"]}
                className="text-[#BB2327] min-w-[200px]"
                interval={2000}
                onIndexChange={setCurrentTextIndex}
              />
            </h1>
            <p className="text-lg text-zinc-500 mb-8 max-w-md leading-relaxed">
              Explore our premium halls and venues designed for events of all
              sizes. Check real-time availability and book instantly.
            </p>
            {/* Optional visual separator or button could go here */}
          </div>

          {/* Right: Polaroid Stack */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative h-[550px] z-0">
            <CardStack
              images={heroImages}
              interval={2000}
              width="500px"
              height="550px"
            />
          </div>
        </div>
      </div>

      {/* Event Categories Section */}
      <div className="container px-4 mb-24">
        <div className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...eventCategories].map((category, index) => (
              <div
                key={index}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
              >
                <ImageWithFallback
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                  <h3 className="text-white leading-tight mb-1 font-[Manrope] text-[18px] sm:text-[20px] italic font-semibold">
                    {category.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-2 font-[Manrope]">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container px-4 mb-24 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-8 font-[Manrope]">
          Hall we have
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {HALLS_DATA.map((hall) => (
            <div key={hall.id} className="cursor-pointer group">
              <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-zinc-100 rounded-lg">
                <ImageWithFallback
                  src={hall.image}
                  alt={hall.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-zinc-900 font-[Manrope] text-[20px]">
                  {hall.name}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-zinc-500 uppercase tracking-wide">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {hall.capacity} Guests
                  </div>

                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                    {(hall.capacity * 15).toLocaleString()} sq ft
                  </div>

                  <div className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    {hall.parkingSpaces} Parking
                  </div>

                  {hall.soundSystem && (
                    <div className="flex items-center gap-1">
                      <Volume2 className="w-4 h-4" />
                      Sound System
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Fan className="w-4 h-4" />
                    Air Conditioning
                  </div>
                </div>

                <div className="text-base text-zinc-400 pt-1">
                  • Bridal Suite
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Memories Section */}
      <div className="container px-4 text-center mb-20 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 font-[Manrope]">
          Customer Memories
        </h2>
        <p className="text-zinc-500 text-sm mb-12">
          Conduct community gatherings, festivals, and cultural shows.
        </p>

        <div className="relative max-w-3xl mx-auto h-[480px] flex justify-center items-center z-0">
          <CardStack
            images={memoryImages}
            interval={3500}
            width="750px"
            height="450px"
          />
        </div>

        {/* Simple dots for pagination look */}
        <div className="flex justify-center gap-2 mt-8">
          <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
          <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
          <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
        </div>
      </div>
    </div>
  );
}
