import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, Check, MapPin, User } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import Link from "next/link";
interface Venue {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  location: string;
  capacity: string;
  image: string;
  thumbnails: string[];
}

const venues: Venue[] = [
  {
    id: 1,
    name: "The Grand Ballroom",
    location: "Main Wing, 2nd Floor",
    capacity: "500-800",
    price: "Starting at $2,500",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1080&auto=format&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1763720058500-7c1dc37492f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlzdGFsJTIwY2hhbmRlbGllciUyMGRldGFpbHxlbnwxfHx8fDE3NjQwNTYxODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1677768061409-3d4fbd0250d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdGFibGUlMjBzZXR0aW5nfGVufDF8fHx8MTc2NDA1NjE4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1080&auto=format&fit=crop", // Reusing main for third just to have 3
    ],
    features: [
      "Crystal Chandeliers",
      "Stage & AV Setup",
      "Private Pre-function Area",
    ],
    description:
      "Our premier space featuring crystal chandeliers, floor-to-ceiling windows, and an expansive dance floor. Perfect for grand weddings and corporate galas.",
  },
  {
    id: 2,
    name: "Skyline Rooftop",
    location: "Rooftop Level",
    capacity: "100-200",
    price: "Starting at $1,800",
    image:
      "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1080&auto=format&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1550064825-b68aa0370fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwYmFyJTIwZHJpbmt8ZW58MXx8fHwxNzY0MDU2MTg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1709054965319-a17f05027f18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0JTIwdmlld3xlbnwxfHx8fDE3NjQwNTYxODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1080&auto=format&fit=crop",
    ],
    features: [
      "Panoramic City Views",
      "Outdoor Bar",
      "Weather-proof Retractable Roof",
    ],
    description:
      "An open-air sanctuary offering breathtaking views of the city skyline. Ideal for cocktail receptions, sunset parties, and intimate networking events.",
  },
  {
    id: 3,
    name: "Executive Conference Center",
    location: "West Wing, 1st Floor",
    capacity: "50-100",
    price: "Starting at $1,200",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1080&auto=format&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1758686254049-8c1d1e8f9564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcm9vbSUyMHNjcmVlbnxlbnwxfHx8fDE3NjQwNTYxODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1678224880435-2d6bbb30eb0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjb2ZmZWUlMjBicmVha3xlbnwxfHx8fDE3NjQwNTYxODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1080&auto=format&fit=crop",
    ],
    features: ["Video Conferencing", "Ergonomic Seating", "Breakout Rooms"],
    description:
      "A state-of-the-art facility designed for productivity. Equipped with the latest presentation technology and high-speed connectivity.",
  },
  {
    id: 4,
    name: "Garden Pavilion",
    location: "North Gardens",
    capacity: "200-350",
    price: "Starting at $2,000",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1080&auto=format&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1735801952479-708659d1a436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBmbG93ZXJzJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjQwNDEzNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1761070775230-1921952439de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZXZlbnQlMjBzZWF0aW5nfGVufDF8fHx8MTc2NDA1NjE4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1080&auto=format&fit=crop",
    ],
    features: ["Lush Greenery", "Natural Lighting", "Adjoining Patio"],
    description:
      "Surrounded by manicured gardens, this glass-enclosed pavilion brings the outdoors in. A romantic setting for ceremonies and daytime luncheons.",
  },
];
const VenueComponent = () => {
  return (
    <div className="space-y-30">
      {venues.map((venue, index) => (
        <motion.div
          key={venue.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-start`}
        >
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative group">
              <ImageWithFallback
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {venue.location}
                </p>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {venue.thumbnails.map((thumb, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden"
                >
                  <ImageWithFallback
                    src={thumb}
                    alt={`${venue.name} detail ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 space-y-6 py-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
                {venue.name}
              </h2>
              <p className="text-lg font-medium text-[#BB2327]">
                {venue.price}
              </p>
            </div>

            <p className="text-lg text-zinc-600 leading-relaxed">
              {venue.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-zinc-700 font-medium">
                <MapPin className="w-5 h-5 text-zinc-400" />
                {venue.location}
              </div>
              <div className="flex items-center gap-3 text-zinc-700 font-medium">
                <User className="w-5 h-5 text-zinc-400" />
                {venue.capacity} Guests
              </div>
              {venue.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-zinc-700 font-medium"
                >
                  <Check className="w-5 h-5 text-[#BB2327]" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href={`/venues/${venue.id}`}>
                <Button
                  className="h-12 rounded-full bg-zinc-900 hover:bg-[#BB2327] text-white font-bold text-lg transition-colors shadow-lg py-[8px]"
                  style={{ paddingLeft: "18px", paddingRight: "18px" }}
                >
                  Inquire about this Space{" "}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VenueComponent;
