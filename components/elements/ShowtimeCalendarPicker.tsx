"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
  baseTimes: string[];
  minDate: string;
  maxDate: string;
}

const formatReadable = (dateValue: string) => {
  const date = new Date(dateValue);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export default function ShowtimeCalendarPicker({
  baseTimes,
  minDate,
  maxDate,
}: Props) {
  const [selected, setSelected] = useState<string>(minDate);

  const summary = useMemo(() => formatReadable(selected), [selected]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur shadow-lg shadow-red-500/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-600/80 text-white">
            <CalendarDays className="w-5 h-5" />
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-rose-200/80">
              Pick a date
            </p>
            <p className="text-base font-semibold">{summary}</p>
          </div>
        </div>
        <input
          type="date"
          min={minDate}
          max={maxDate}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-red-200 bg-white px-3 py-2 text-slate-900 font-semibold outline-none ring-1 ring-transparent transition focus:border-red-400/80 focus:ring-red-400/40"
          aria-label="Pick a date for showtimes"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {baseTimes.map((time) => (
          <Button
            key={`${selected}-${time}`}
            variant="outline"
            className="border-red-400/50 text-white hover:border-red-300 hover:text-red-100 bg-white/5"
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
}
