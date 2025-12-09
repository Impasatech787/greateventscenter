import React from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Heart,
  LayoutGrid,
  Film,
  Music,
  Building2,
} from "lucide-react";

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  buttonText,
}) => {
  return (
    //The  button should have the same y-axis alignment for all cards and all card should have same height
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md  transition-all duration-300 hover:-translate-y-1 ease-in-out group h-full">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4   group-hover:bg-red-100/90">
          <Icon className="w-6 h-6 text-gray-700 group-hover:text-red-700 " />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        <Button
          variant="outline"
          className="rounded-full px-5 py-2 text-sm font-medium  hover:bg-red-700 hover:text-white"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

const services = [
  {
    icon: Calendar,
    title: "Book Event Venue",
    description:
      "Perfect spaces for parties, gatherings, and special occasions.",
    buttonText: "Book Now",
  },
  {
    icon: Heart,
    title: "Book Wedding Venue",
    description:
      "Make your special day unforgettable in our elegant wedding halls.",
    buttonText: "Book Now",
  },
  {
    icon: LayoutGrid,
    title: "Rent Movie Theatre",
    description:
      "Private screenings and premieres in our state-of-the-art theaters.",
    buttonText: "Rent Now",
  },
  {
    icon: Film,
    title: "Buy Movie Ticket",
    description: "Catch the latest blockbusters on the big screen.",
    buttonText: "Buy Now",
  },
  {
    icon: Music,
    title: "Buy Concert, Event & Show Tickets",
    description:
      "Live entertainment, music concerts, and stand-up comedy shows.",
    buttonText: "Buy Now",
  },
  {
    icon: Building2,
    title: "Corporate Events Hall",
    description:
      "Professional settings for conferences, seminars, and business meetings.",
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
              icon={service.icon}
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
