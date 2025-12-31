import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  imageSrc: string;
  title: string;
  description: string;
  buttonText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  imageSrc,
  title,
  description,
  buttonText,
}) => {
  return (
    //The  button should have the same y-axis alignment for all cards and all card should have same height
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 ring-1 ring-transparent transition-shadow duration-300 ease-out group h-full overflow-hidden hover:shadow-lg hover:ring-red-100">
        <div className="relative h-48 sm:h-52 w-full bg-gray-100">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">
            {description}
          </p>
          <Button
            variant="outline"
            className="rounded-full px-5 py-2 text-sm font-medium hover:bg-red-700 hover:text-white"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

const services = [
  {
    imageSrc: "/GreatEventsBanner.webp",
    title: "Book Event Venue",
    description:
      "Perfect spaces for parties, gatherings, and special occasions.",
    buttonText: "Book Now",
  },
  {
    imageSrc: "/uploads/blogs/1765551118605.jpg",
    title: "Book Wedding Venue",
    description:
      "Make your special day unforgettable in our elegant wedding halls.",
    buttonText: "Book Now",
  },
  {
    imageSrc: "/uploads/movie-posters/1766380427118.png",
    title: "Rent Movie Theatre",
    description:
      "Private screenings and premieres in our state-of-the-art theaters.",
    buttonText: "Rent Now",
  },
  {
    imageSrc: "/uploads/movie-posters/1766391280333.jpg",
    title: "Buy Movie Ticket",
    description: "Catch the latest blockbusters on the big screen.",
    buttonText: "Buy Now",
  },
  {
    imageSrc: "/uploads/blogs/1765551161451.jpg",
    title: "Buy Concert, Event & Show Tickets",
    description:
      "Live entertainment, music concerts, and stand-up comedy shows.",
    buttonText: "Buy Now",
  },
  {
    imageSrc: "/uploads/movie-posters/1765777791040.jpg",
    title: "Event Decoration Services",
    description:
      "Transforming Your Moments into Beautiful Memories with Our Expert Decoration Services.",
    buttonText: "Book Now",
  },
];
const OurServices: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white ">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Our Services
          </h2>
          <p className="text-gray-500 text-lg">
            Everything you need for entertainment and events, all in one place.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              imageSrc={service.imageSrc}
              title={service.title}
              description={service.description}
              buttonText={service.buttonText}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
