"use client";

import { Button } from "@/components/ui/button";
import { Car, MapPin, Music, Star, Users } from "lucide-react";
import Image from "next/image";

type HallStatus = "Available" | "Limited" | "Booked";

interface HallAmenity {
  icon: React.ReactNode;
  label: string;
}

interface Hall {
  id: number;
  name: string;
  location: string;
  image: string;
  status: HallStatus;
  rating: number;
  guests: number;
  parking: number;
  amenities: HallAmenity[];
  features: string[];
  price: number;
}

const halls: Hall[] = [
  {
    id: 1,
    name: "Hall A - Grand Ballroom",
    location: "Main Wing, Ground Floor",
    image: "/MovieImage.png",
    status: "Available",
    rating: 4.9,
    guests: 500,
    parking: 100,
    amenities: [{ icon: <Music className="w-4 h-4" />, label: "Sound System" }],
    features: ["Air Conditioning", "Bridal Suite"],
    price: 600,
  },
  {
    id: 2,
    name: "Hall B - Sapphire Banquet",
    location: "East Wing, Second Floor",
    image: "/MovieImage.png",
    status: "Limited",
    rating: 4.8,
    guests: 250,
    parking: 80,
    amenities: [{ icon: <Music className="w-4 h-4" />, label: "Sound System" }],
    features: ["Climate Control", "Prep Kitchen"],
    price: 500,
  },
  {
    id: 3,
    name: "Hall C - Executive Meeting",
    location: "North Tower, Third Floor",
    image: "/MovieImage.png",
    status: "Available",
    rating: 5,
    guests: 80,
    parking: 30,
    amenities: [{ icon: <Music className="w-4 h-4" />, label: "Sound System" }],
    features: ["Video Conferencing", "4K Projector"],
    price: 300,
  },
  {
    id: 4,
    name: "Hall D - Community Space",
    location: "West Wing, Ground Floor",
    image: "/MovieImage.png",
    status: "Available",
    rating: 4.7,
    guests: 150,
    parking: 40,
    amenities: [{ icon: <Music className="w-4 h-4" />, label: "Sound System" }],
    features: ["Kitchen Facilities", "Storage Room"],
    price: 400,
  },
];

const StatusBadge = ({ status }: { status: HallStatus }) => {
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

interface HallCardProps {
  hall: Hall;
}

const HallCard = ({ hall }: HallCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 ease-in-out ">
      {/* Image */}
      <div className="relative h-75 bg-gray-200">
        <Image src={hall.image} alt={hall.name} fill className="object-cover" />
        <div className="absolute top-3 left-3">
          <StatusBadge status={hall.status} />
        </div>
      </div>

      {/* Content */}
      <div className="py-6 px-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-xl">{hall.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-black text-black" />
            <span className="text-sm font-medium text-gray-700">
              {hall.rating}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3" />
          <span>{hall.location}</span>
        </div>

        {/* Capacity & Parking */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <Users className="w-4 h-4" />
            <span>{hall.guests} Guests</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <Car className="w-4 h-4" />
            <span>{hall.parking} Parking</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-2 mb-3">
          {hall.amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-1 text-gray-600 text-xs"
            >
              {amenity.icon}
              <span>{amenity.label}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {hall.features.map((feature, index) => (
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
            <span className="font-bold text-xl text-gray-900">${hall.price}</span><br></br>
            <span className="text-xs text-gray-500"> per 3hr</span>
          </div>
          <Button
            size="md"
            className="bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const AvailableHalls = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 lg:px-0">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Available Halls
        </h2>

        {/* Halls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableHalls;
