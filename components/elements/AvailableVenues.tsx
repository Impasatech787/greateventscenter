"use client";

import { Button } from "@/components/ui/button";
import { Car, MapPin, Music, Star, Users } from "lucide-react";
import Image from "next/image";

type VenueStatus = "Available" | "Limited" | "Booked";

interface Venue {
  id: number;
  name: string;
  location: string;
  image: string;
  status: VenueStatus;
  rating: number;
  guests: number;
  parking: number;
  hasAudio: boolean;
  features: string[];
  price: number;
}

const venues: Venue[] = [
  {
    id: 1,
    name: "Skyline Rooftop",
    location: "Rooftop Level",
    image: "/MovieImage.png",
    status: "Booked",
    rating: 4.9,
    guests: 150,
    parking: 20,
    hasAudio: true,
    features: ["Panoramic Views", "Outdoor Bar"],
    price: 1800,
  },
  {
    id: 2,
    name: "Garden Pavilion",
    location: "North Gardens",
    image: "/MovieImage.png",
    status: "Available",
    rating: 4.8,
    guests: 275,
    parking: 100,
    hasAudio: true,
    features: ["Lush Greenery", "Natural Lighting"],
    price: 2000,
  },
];

const StatusBadge = ({ status }: { status: VenueStatus }) => {
  const statusStyles = {
    Available: "bg-green-500 text-white",
    Limited: "bg-yellow-500 text-white",
    Booked: "bg-red-500 text-white",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

interface VenueCardProps {
  venue: Venue;
}

const VenueCard = ({ venue }: VenueCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 ease-in-out ">
      {/* Image */}
      <div className="relative h-52 bg-gray-200">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={venue.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{venue.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-black text-black" />
            <span className="text-sm font-medium text-gray-700">
              {venue.rating}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3" />
          <span>{venue.location}</span>
        </div>

        {/* Capacity & Parking */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <Users className="w-4 h-4" />
            <span>{venue.guests} Guests</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <Car className="w-4 h-4" />
            <span>{venue.parking} Parking</span>
          </div>
        </div>

        {/* Audio */}
        {venue.hasAudio && (
          <div className="flex items-center gap-1 text-gray-600 text-xs mb-3">
            <Music className="w-4 h-4" />
            <span>Sound System</span>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {venue.features.map((feature, index) => (
            <span
              key={index}
              className="text-xs text-gray-500 flex items-center gap-1"
            >
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              {feature}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500">From </span>
            <span className="font-bold text-gray-900">${venue.price}</span>
            <span className="text-xs text-gray-500"> per 3hr</span>
          </div>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-5"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const AvailableVenues = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 lg:px-0">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Available Venues
        </h2>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableVenues;
