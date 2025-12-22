"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays, Sparkles } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SeatSelectionAccordion } from "@/components/elements/HallLayout";
import hallLayoutData from "@/app/data/hall-layout.json";

interface Seat {
  index: number;
  is_active: boolean;
  seat_type: string;
  seat_label: string;
  ticket_type: string;
  seat_id: number;
  section_label: string;
  seat_status: "Normal" | "Available" | "Sold" | "Selected" | "Blocked";
}

interface Row {
  row: string;
  index: number;
  seats: Seat[];
}

export interface Showtime {
  ids?: number[];
  label: string;
  date: string;
  format: string;
  theater: string;
  premiumTag?: string;
  times: TimeId[];
}
interface TimeId {
  time: string;
  id: number;
}

interface Props {
  movieTitle: string;
  showtimes: Showtime[];
}

interface ParsedShowtime extends Showtime {
  dateObj: Date;
  weekday: string;
  month: string;
  day: string;
}

// Parse showtime date string to Date object (e.g., "Mon, Jul 15" -> Date)
const parseShowtimeDate = (dateStr: string, baseYear: number): Date => {
  const [, rest] = dateStr.split(",");
  if (!rest) return new Date();

  const parts = rest.trim().split(" ");
  const monthStr = parts[0] || "Jan";
  const dayStr = parts[1] || "1";

  const monthMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const month = monthMap[monthStr] ?? 0;
  const day = parseInt(dayStr, 10) || 1;

  return new Date(baseYear, month, day);
};

const formatReadable = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export default function ShowtimeCalendarPicker({
  movieTitle,
  showtimes,
}: Props) {
  // Parse all showtime dates
  const currentYear = new Date().getFullYear();
  const parsedShowtimes = useMemo<ParsedShowtime[]>(() => {
    return showtimes.map((showtime) => {
      const [weekdayRaw, rest] = showtime.date.split(",");
      const weekday = weekdayRaw?.trim() ?? "";
      const month = rest?.trim().split(" ")[0] ?? "";
      const day = rest?.trim().split(" ")[1] ?? "";
      const dateObj = parseShowtimeDate(showtime.date, currentYear);

      return {
        ...showtime,
        dateObj,
        weekday,
        month,
        day,
      };
    });
  }, [showtimes, currentYear]);

  // Get available dates (Date objects) for calendar
  const availableDates = useMemo(() => {
    return parsedShowtimes.map((s) => s.dateObj);
  }, [parsedShowtimes]);

  // First 3 showtimes for quick select
  const quickSelectShowtimes = parsedShowtimes.slice(0, 3);

  const [selectedShowtimeData, setSelectedShowtimeData] =
    useState<ParsedShowtime | null>(quickSelectShowtimes[0] || null);
  const [selectedShow, setSelectedShow] = useState<TimeId | null>(null);
  const seatSelectionRef = useRef<HTMLDivElement>(null);

  const summary = useMemo(
    () =>
      selectedShowtimeData
        ? formatReadable(selectedShowtimeData.dateObj)
        : "Select a date",
    [selectedShowtimeData]
  );

  // Scroll to seat selection when a time is selected
  useEffect(() => {
    if (selectedShow && seatSelectionRef.current) {
      setTimeout(() => {
        seatSelectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedShow]);

  const handleDateSelect = (showtime: ParsedShowtime) => {
    setSelectedShowtimeData(showtime);
    setSelectedShow(null); // Reset time selection
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;

    // Find matching showtime
    const matching = parsedShowtimes.find(
      (s) => s.dateObj.toDateString() === date.toDateString()
    );

    if (matching) {
      setSelectedShowtimeData(matching);
      setSelectedShow(null);
    }
  };

  const handleTimeSelect = (time: TimeId) => {
    setSelectedShow(time);
    fetchShow(time.id);
  };

  // Check if a date is available (has showtimes)
  const isDateAvailable = (date: Date): boolean => {
    return availableDates.some((d) => d.toDateString() === date.toDateString());
  };

  const fetchShow = async (showId: number) => {
    console.log("Fetching show for ID:", showId);
    try {
      const res = await fetch(`/api/movies/show/${showId}`);
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Quick select showtime cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {quickSelectShowtimes.map((slot) => (
          <button
            key={`${slot.label}-${slot.date}`}
            onClick={() => handleDateSelect(slot)}
            className={`min-w-[150px] rounded-2xl border p-4 backdrop-blur shadow-lg transition-all text-left ${
              selectedShowtimeData?.date === slot.date
                ? "border-rose-500/60 bg-rose-500/20 shadow-rose-500/20"
                : "border-white/10 bg-white/5 shadow-red-500/15 hover:border-white/20 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-rose-100">
              <span>{slot.label}</span>
              {slot.premiumTag && (
                <Sparkles className="w-3 h-3 text-rose-100" />
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="text-4xl font-bold leading-none text-white">
                {slot.day || "—"}
              </div>
              <div className="flex flex-col text-sm text-slate-200">
                <span className="uppercase tracking-[0.2em]">
                  {slot.month || "Date"}
                </span>
                <span className="text-emerald-200/80">{slot.weekday}</span>
              </div>
            </div>
            {/* <p className="mt-3 text-xs text-slate-200/80">{slot.format}</p> */}
          </button>
        ))}
      </div>

      {/* Date picker and times */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur shadow-lg shadow-red-500/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-600/80 text-white">
              <CalendarDays className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-rose-200/80">
                Selected date
              </p>
              <p className="text-base font-semibold">{summary}</p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-lg border-red-400/40 bg-white/10 px-4 py-2 text-white font-semibold hover:bg-white/20 hover:border-red-300"
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                More Dates
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-slate-900 border-white/10"
              align="end"
            >
              <Calendar
                mode="single"
                selected={selectedShowtimeData?.dateObj}
                onSelect={handleCalendarSelect}
                disabled={(date) => !isDateAvailable(date)}
                className="bg-slate-900 text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Available times for selected date */}
        {selectedShowtimeData && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.15em] text-rose-200/60 mb-2">
              Available times
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedShowtimeData.times.map((time) => (
                <Button
                  key={`${selectedShowtimeData.date}-${time.id}`}
                  variant="outline"
                  className={`cursor-pointer border-red-400/50 text-white bg-white/5
    hover:bg-red-600 hover:text-white 
    hover:border-red-500 transition-all
    ${
      selectedShow === time
        ? "bg-rose-500/30 border-rose-400 ring-1 ring-rose-400/50"
        : ""
    }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time.time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Seat Selection Accordion */}
      {selectedShow && selectedShowtimeData && (
        <div ref={seatSelectionRef} className="mt-6">
          <SeatSelectionAccordion
            data={{
              session_id: hallLayoutData.session_id,
              new_seats: hallLayoutData.new_seats as Row[],
              screen_reverse: hallLayoutData.screen_reverse,
              showinfo: {
                show: {
                  ...hallLayoutData.showinfo.show,
                  movie_name: movieTitle,
                },
                tickets: hallLayoutData.showinfo.tickets,
              },
            }}
            selectedTime={selectedShow?.time}
            selectedDate={selectedShowtimeData.date}
            maxSeats={10}
          />
        </div>
      )}
    </>
  );
}
