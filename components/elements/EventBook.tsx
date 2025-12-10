"use client";

import { Hall } from "@/app/data/hall-data";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Award,
  CalendarIcon,
  Car,
  Check,
  ChevronDown,
  Clock,
  Info,
  MapPin,
  ShieldCheck,
  Speaker,
  Star,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const EventBook: React.FC<{ hall: Hall }> = ({ hall }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guestCount, setGuestCount] = useState("50-100");
  const [timeSlot, setTimeSlot] = useState<string | undefined>();
  const serviceFee = 100;
  const cleaningFee = 150;
  const basePrice = hall.pricing[0].price;
  const total = basePrice + serviceFee + cleaningFee;
  // Mock blocked dates (e.g., next 2 days are booked)
  const today = new Date();
  const blockedDate1 = new Date(today);
  blockedDate1.setDate(today.getDate() + 2);
  const blockedDate2 = new Date(today);
  blockedDate2.setDate(today.getDate() + 3);

  const timeSlots = [
    "Morning (8:00 AM - 12:00 PM)",
    "Afternoon (1:00 PM - 5:00 PM)",
    "Evening (6:00 PM - 11:00 PM)",
    "Full Day (8:00 AM - 11:00 PM)",
  ];
  return (
    <>
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-20 relative">
        {/* Left Column: Content */}
        <div>
          {/* Host Info */}
          <div className="flex justify-between items-center py-8 border-b border-zinc-200">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900 mb-1">
                Entire venue hosted by Great Events
              </h2>
              <div className="flex gap-4 text-zinc-600 text-base">
                <span>{hall.capacity} guests</span>
                <span>·</span>
                <span>{hall.pricing.length} pricing plans</span>
                <span>·</span>
                <span>{hall.parkingSpaces} parking spots</span>
              </div>
            </div>
            <Avatar className="w-14 h-14 border border-zinc-200">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>GE</AvatarFallback>
            </Avatar>
          </div>

          {/* Calendar & Availability - MOVED HERE */}
          <div className="py-10 border-b border-zinc-200">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
              Available Dates & Times
            </h2>
            <p className="text-zinc-500 mb-6">
              Select a date to see available slots
            </p>

            <div className="bg-zinc-50 rounded-2xl p-6 w-full max-w-3xl border border-zinc-100">
              <div className="flex flex-col md:flex-row justify-center items-center w-full gap-8">
                <div className="flex-grow">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setTimeSlot(undefined); // Reset slot on date change
                    }}
                    disabled={[
                      { before: new Date() }, // Disable past dates
                      blockedDate1,
                      blockedDate2, // Disable mocked dates
                    ]}
                    className="w-full rounded-xl bg-white border border-zinc-100 shadow-sm p-4"
                    classNames={{
                      month: "space-y-4 w-full",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full",
                      head_cell:
                        "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full h-10",
                      day: "h-10 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-zinc-100 rounded-md",
                      day_selected:
                        "bg-[#BB2327] text-white hover:bg-[#a01d21] focus:bg-[#BB2327]",
                      day_today: "bg-zinc-100 text-zinc-900 font-bold",
                      day_disabled:
                        "text-zinc-300 opacity-50 cursor-not-allowed bg-zinc-50",
                    }}
                  />
                  <div className="mt-4 flex gap-4 text-xs text-zinc-500 justify-center md:justify-start">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-white border border-zinc-200 rounded-sm"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-zinc-100 text-zinc-300 rounded-sm flex items-center justify-center text-[8px]"></div>
                      <span>Booked/Closed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-[#BB2327] rounded-sm"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                </div>

                {/* Time Slot Selection - Shows only when date is selected */}
                {date && (
                  <div className="w-full md:w-64 flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
                    <h3 className="font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Available Slots for {date.toLocaleDateString()}
                    </h3>
                    <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                      {timeSlots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => setTimeSlot(slot)}
                          className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                            timeSlot === slot
                              ? "border-[#BB2327] bg-red-50 text-[#BB2327] font-semibold shadow-sm"
                              : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center max-w-md">
              <button
                className="font-semibold underline text-zinc-900"
                onClick={() => {
                  setDate(undefined);
                  setTimeSlot(undefined);
                }}
              >
                Clear dates
              </button>
            </div>
          </div>

          {/* Highlights */}
          <div className="py-8 border-b border-zinc-200 space-y-6">
            <div className="flex gap-4">
              <Award className="w-7 h-7 text-zinc-900 mt-1" />
              <div>
                <h3 className="font-semibold text-zinc-900 text-base">
                  Premier Host
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  Great Events Center is a highly rated host committed to
                  providing great stays for guests.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="w-7 h-7 text-zinc-900 mt-1" />
              <div>
                <h3 className="font-semibold text-zinc-900 text-base">
                  Great location
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  95% of recent guests gave the location a 5-star rating.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CalendarIcon className="w-7 h-7 text-zinc-900 mt-1" />
              <div>
                <h3 className="font-semibold text-zinc-900 text-base">
                  Free cancellation for 48 hours
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  Get a full refund if you change your mind.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-8 border-b border-zinc-200">
            <div className="prose prose-zinc max-w-none text-zinc-900">
              <p className="text-base leading-7">{hall.description}</p>
              <p className="text-base leading-7 mt-4">
                This space is perfect for weddings, corporate events, and large
                gatherings. Equipped with state-of-the-art facilities including{" "}
                {hall.soundSystem ? "a premium sound system" : "basic audio"}
                and{" "}
                {hall.catering
                  ? "full catering capabilities"
                  : "flexible catering options"}
                .
              </p>
            </div>
            <button className="mt-4 flex items-center gap-1 font-semibold underline decoration-zinc-900 decoration-1 underline-offset-2">
              Show more <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Amenities */}
          <div className="py-10 border-b border-zinc-200">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-6">
              What this place offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
              {hall.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-4 text-zinc-700">
                  {i === 0 && <Wifi className="w-6 h-6" />}
                  {i === 1 && <Car className="w-6 h-6" />}
                  {i === 2 && <Speaker className="w-6 h-6" />}
                  {i === 3 && <UtensilsCrossed className="w-6 h-6" />}
                  {i > 3 && <Check className="w-6 h-6" />}
                  <span className="text-base">{amenity}</span>
                </div>
              ))}
              <div className="flex items-center gap-4 text-zinc-700">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-base">Security cameras on property</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-8 border-zinc-900 text-zinc-900 font-semibold h-12 px-6 rounded-lg hover:bg-zinc-50"
            >
              Show all {hall.amenities.length + 5} amenities
            </Button>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="relative">
          <div className="sticky top-28 w-full">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_6px_16px_rgba(0,0,0,0.12)] p-6">
              <div className="flex justify-between items-baseline mb-6">
                <div>
                  <span className="text-2xl font-bold text-zinc-900">
                    ${basePrice}
                  </span>
                  <span className="text-zinc-500 ml-1"> / event</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  <Star className="w-3 h-3 fill-zinc-900" />
                  {hall.rating} ·{" "}
                  <span className="text-zinc-500 underline">
                    {hall.reviewCount} reviews
                  </span>
                </div>
              </div>

              {/* Booking Details Summary */}
              <div className="border border-zinc-300 rounded-xl mb-4 overflow-hidden">
                {/* Date Selection Display */}
                <div className="p-3 border-b border-zinc-300 bg-white">
                  <div className="text-[10px] font-bold uppercase text-zinc-800 mb-1">
                    Date
                  </div>
                  {date ? (
                    <div className="text-sm font-medium text-zinc-900">
                      {date.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-400 italic">
                      Select a date
                    </div>
                  )}
                </div>

                {/* Time Slot Display */}
                <div className="p-3 border-b border-zinc-300 bg-white">
                  <div className="text-[10px] font-bold uppercase text-zinc-800 mb-1">
                    Time Slot
                  </div>
                  {timeSlot ? (
                    <div className="text-sm font-medium text-zinc-900">
                      {timeSlot}
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-400 italic">
                      Select a slot
                    </div>
                  )}
                </div>

                {/* Guests Selection */}
                <div className="p-3 bg-white">
                  <div className="text-[10px] font-bold uppercase text-zinc-800 mb-1">
                    Guests
                  </div>
                  <Select value={guestCount} onValueChange={setGuestCount}>
                    <SelectTrigger className="w-full h-8 px-12 border-0 p-0 text-sm font-medium text-zinc-900 focus:ring-0 shadow-none">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">Up to 50 guests</SelectItem>
                      <SelectItem value="50-100">50 - 100 guests</SelectItem>
                      <SelectItem value="100-200">100 - 200 guests</SelectItem>
                      <SelectItem value="200-300">200 - 300 guests</SelectItem>
                      <SelectItem value="300-400">300 - 400 guests</SelectItem>
                      <SelectItem value="400-500">400 - 500 guests</SelectItem>
                      <SelectItem value="500+">500+ guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                disabled={!date || !timeSlot}
                className={`w-full font-bold text-lg h-12 rounded-lg mb-3 transition-all ${
                  !date || !timeSlot
                    ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                    : "bg-[#E51D53] hover:bg-[#D41B4C] text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                Instant Book
              </Button>

              <Button
                variant="outline"
                className="w-full border-zinc-900 text-zinc-900 font-semibold h-10 rounded-lg mb-4 hover:bg-zinc-50"
              >
                Inquire / Schedule Tour
              </Button>

              {date && timeSlot && (
                <div className="bg-zinc-50 p-3 rounded-lg flex gap-3 items-start mb-4">
                  <Info className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    <span className="font-semibold text-zinc-700">
                      Instant Booking:
                    </span>{" "}
                    One of our team members will contact you shortly after
                    booking to confirm details.
                  </p>
                </div>
              )}

              <div className="text-center text-sm text-zinc-500 mb-6">
                You won&apos;t be charged yet
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-zinc-600 text-base">
                <div className="flex justify-between underline decoration-zinc-300">
                  <span>${basePrice} x 1 event</span>
                  <span>${basePrice}</span>
                </div>
                <div className="flex justify-between underline decoration-zinc-300">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between underline decoration-zinc-300">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-lg text-zinc-900">
                <span>Total before taxes</span>
                <span>${total}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-zinc-500 text-sm">
              <Award className="w-4 h-4" />
              <span className="font-bold text-zinc-800">Rare find.</span> This
              place is usually booked.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventBook;
