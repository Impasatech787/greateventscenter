"use client";
import { Button } from "@/components/ui/button";
import { HALLS_DATA } from "@/app/data/hall-data";
import { motion } from "framer-motion";
import { Award, Heart, MapPin, Share2, ShieldCheck, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/elements/ImageWithFallback";
import EventBook from "@/components/elements/EventBook";
import { useState } from "react";
import LightBox from "@/components/elements/LightBox";
import ShareModal from "@/components/elements/ShareModal";
export default function VenueDetailPage() {
  const hall = HALLS_DATA[0];
  const [isLightBox, setIsLightBox] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [shareOpen, setShareOpen] = useState<boolean>(false);

  if (!hall) {
    return <div className="py-32">Hall Detail Page</div>;
  }
  const venueUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/venues/${hall.id}`
      : `${process.env.NEXT_PUBLIC_BASE_URL || "https://digitallibrary.com"}/articles/${hall.id}`;

  const today = new Date();
  const blockedDate1 = new Date(today);
  blockedDate1.setDate(today.getDate() + 2);
  const blockedDate2 = new Date(today);
  blockedDate2.setDate(today.getDate() + 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pt-24 pb-20"
    >
      <div className="max-w-[1120px] mx-auto px-6">
        {/* Title Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900 mb-2">
            {hall.name}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-zinc-800 font-medium underline decoration-zinc-300 underline-offset-4">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-black text-black" />
                {hall.rating}
              </span>
              <span>·</span>
              <span className="hover:text-zinc-600 cursor-pointer">
                {hall.reviewCount} reviews
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 hover:text-zinc-600 cursor-pointer">
                {hall.location}
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 text-sm font-medium hover:bg-zinc-100 px-3 py-2 rounded-lg transition-colors underline decoration-zinc-200"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-2 text-sm font-medium hover:bg-zinc-100 px-3 py-2 rounded-lg transition-colors underline decoration-zinc-200">
                <Heart className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          venueName={hall.name}
          venueUrl={venueUrl}
        />

        {/* Image Grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-12 relative">
          <div className="col-span-2 row-span-2 relative cursor-pointer hover:opacity-95 transition-opacity">
            <ImageWithFallback
              onClick={() => {
                setImageIndex(0);
                setIsLightBox(true);
              }}
              src={hall.galleryImages[0]}
              alt="Main"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-1 row-span-1 relative cursor-pointer hover:opacity-95 transition-opacity">
            <ImageWithFallback
              onClick={() => {
                setIsLightBox(true);
                setImageIndex(1);
              }}
              src={hall.galleryImages[1]}
              alt="Sub 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-1 row-span-1 relative cursor-pointer hover:opacity-95 transition-opacity rounded-tr-2xl">
            <ImageWithFallback
              onClick={() => {
                setIsLightBox(true);
                setImageIndex(2);
              }}
              src={hall.galleryImages[2]}
              alt="Sub 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-1 row-span-1 relative cursor-pointer hover:opacity-95 transition-opacity">
            <ImageWithFallback
              onClick={() => {
                setIsLightBox(true);
                setImageIndex(3);
              }}
              src={hall.galleryImages[3]}
              alt="Sub 3"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-1 row-span-1 relative cursor-pointer hover:opacity-95 transition-opacity rounded-br-2xl">
            <ImageWithFallback
              onClick={() => {
                setIsLightBox(true);
                setImageIndex(4);
              }}
              src={hall.galleryImages[4]}
              alt="Sub 4"
              className="w-full h-full object-cover"
            />
            <Button
              variant="secondary"
              className="absolute bottom-4 right-4 bg-white text-black hover:bg-zinc-100 border border-black font-medium text-sm h-8 px-4 shadow-sm"
              onClick={() => setIsLightBox(true)}
            >
              Show all photos
            </Button>
          </div>
        </div>
        <LightBox
          images={hall.galleryImages}
          isOpen={isLightBox}
          initialIndex={imageIndex}
          onClose={() => {
            setIsLightBox(false);
            setImageIndex(0);
          }}
        />

        {/* Two Column Layout */}
        <EventBook hall={hall} />

        <Separator className="my-12" />

        {/* Reviews Section Placeholder */}
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Star className="w-6 h-6 fill-zinc-900" />
            <h2 className="text-2xl font-semibold text-zinc-900">
              {hall.rating} · {hall.reviewCount} reviews
            </h2>
          </div>

          {/* Rating Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 mb-8">
            {[
              "Cleanliness",
              "Accuracy",
              "Communication",
              "Location",
              "Check-in",
              "Value",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-zinc-700">{item}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-1 bg-zinc-200 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 w-[95%]"></div>
                  </div>
                  <span className="text-sm font-bold">4.8</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Map Placeholder */}
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 mb-6">
            Where you&apos;ll be
          </h2>
          <div className="w-full h-[480px] bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Map view integration required</p>
              <p className="text-sm">{hall.location}</p>
            </div>
          </div>
        </div>

        {/* Host Section */}
        <div className="mt-12 py-8 border-t border-zinc-200">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>GE</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">
                Hosted by Great Events Center
              </h3>
              <div className="text-zinc-500 text-sm">Joined May 2015</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4 text-zinc-600 leading-relaxed">
              <p>
                Great Events Center is a premier venue management company
                dedicated to creating unforgettable experiences. We specialize
                in weddings, corporate gatherings, and social celebrations.
              </p>
              <p>
                Our team is available 24/7 to assist with your planning needs.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-zinc-700">
                <Star className="w-5 h-5" />
                <span>1,240 Reviews</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-700">
                <ShieldCheck className="w-5 h-5" />
                <span>Identity verified</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-700">
                <Award className="w-5 h-5" />
                <span>Superhost</span>
              </div>
              <Button
                variant="outline"
                className="mt-4 border-zinc-900 text-zinc-900 font-semibold"
              >
                Contact Host
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
