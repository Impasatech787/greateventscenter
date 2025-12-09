"use client";
import VenueComponent from "@/components/elements/VenueComponent";
import { motion } from "framer-motion";
export default function VenuesPage() {
  return (
    <div className="bg-white">
      <div className="container px-4 pt-24">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6 tracking-tight"
          >
            Our Venues
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-500"
          >
            Explore our diverse collection of event spaces, each designed to
            create unforgettable experiences for you and your guests.
          </motion.p>
        </div>
        <VenueComponent />
      </div>
    </div>
  );
}
