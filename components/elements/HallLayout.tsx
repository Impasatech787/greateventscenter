"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
  Armchair,
  Accessibility,
} from "lucide-react";
import { seat as Seat, SeatType } from "@/app/generated/prisma";
import { ShowTicketPrice } from "./ShowtimeCalendarPicker";
import { useRole } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";

interface SeatRow {
  row: string;
  seats: SeatCell[];
}
export interface SeatCell {
  key: string;
  seat?: Seat;
}

interface ShowInfo {
  show: {
    show_id: string;
    datetime: string;
    movie_name: string;
    theatre_name: string;
    auditorium_name: string;
  };
  tickets: ShowTicketPrice[];
}

interface HallLayoutData {
  showId: number;
  seats: (Seat & { bookStatus: string })[];
  showinfo: ShowInfo;
}

interface HallLayoutProps {
  data: HallLayoutData;
  onSelectionChange?: (seats: Seat[]) => void;
  maxSeats?: number;
  selectedTime?: string;
  selectedDate?: string;
  onClose?: () => void;
}

// Seat status colors - matching movie theme
const seatStatusColors = {
  Normal: {
    bg: "bg-emerald-500/20 hover:bg-emerald-500/40 border-emerald-500/50",
    text: "text-emerald-100",
    cursor: "cursor-pointer",
  },
  AVAILABLE: {
    bg: "bg-emerald-500/20 hover:bg-emerald-500/40 border-emerald-500/50",
    text: "text-emerald-100",
    cursor: "cursor-pointer",
  },
  HELD: {
    bg: "bg-zinc-800/50 border-zinc-700/50",
    text: "text-zinc-600",
    cursor: "cursor-not-allowed",
  },
  BOOKED: {
    bg: "bg-zinc-800/50 border-zinc-700/50",
    text: "text-zinc-600",
    cursor: "cursor-not-allowed",
  },

  Selected: {
    bg: "bg-rose-500 hover:bg-rose-400 border-rose-400",
    text: "text-white font-semibold",
    cursor: "cursor-pointer",
  },
  Blocked: {
    bg: "bg-red-900/30 border-red-800/50",
    text: "text-red-400",
    cursor: "cursor-not-allowed",
  },
  WHEELCHAIR: {
    bg: "bg-blue-500/20 hover:bg-blue-500/40 border-blue-500/50",
    text: "text-blue-100",
    cursor: "cursor-pointer",
  },
};
interface SelectedSeat extends Seat {
  priceCents: number;
}

const HallLayout = ({
  data,
  onSelectionChange,
  maxSeats = 10,
  selectedTime,
  selectedDate,
  onClose,
}: HallLayoutProps) => {
  const router = useRouter();
  const { loggedUser } = useRole();
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[] | []>([]);
  const [zoom, setZoom] = useState(1);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const rows: SeatRow[] = useMemo(() => {
    const byRow = new Map<string, Seat[]>();
    for (const s of data.seats) {
      if (!byRow.has(s.row)) byRow.set(s.row, []);
      byRow.get(s.row)!.push(s);
    }
    const rowLabels = [...byRow.keys()].sort((a, b) => a.localeCompare(b));
    return rowLabels.map((rowLabel) => {
      const rowSeats = byRow.get(rowLabel)!;

      rowSeats.sort((a, b) => Number(a.number) - Number(b.number));

      const cells: SeatCell[] = [];
      for (const s of rowSeats) {
        cells.push({ key: `seat-${s.number}`, seat: s });
      }
      return { row: rowLabel, seats: cells };
    });
  }, [data.seats]);

  // Calculate totals
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => {
      const ticket = data.showinfo.tickets.find(
        (t) => t.seatType === seat.seatType,
      );
      return sum + (ticket?.priceCents || 0) / 100;
    }, 0);
  }, [selectedSeats, data.showinfo.tickets]);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const handleSeatSelect = (seat: Seat & { bookStatus: string }) => {
    if (seat.bookStatus === "HELD" || seat.bookStatus === "BOOKED") {
      return;
    }
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      let newSelection: SelectedSeat[];
      if (isSelected) {
        newSelection = prev.filter((s) => s.id !== seat.id);
      } else {
        if (prev.length >= maxSeats) {
          return prev; // Max seats reached
        }
        // Find the ticket price for this seat type
        const ticket = data.showinfo.tickets.find(
          (t) => t.seatType === seat.seatType,
        );
        newSelection = [
          ...prev,
          {
            id: seat.id,
            row: seat.row,
            number: seat.number,
            seatType: seat.seatType,
            auditoriumId: seat.auditoriumId,
            rowOffset: seat.rowOffset,
            columnOffset: seat.columnOffset,
            priceCents: ticket?.priceCents ?? 0,
          },
        ];
      }
      // onSelectionChange?.(newSelection);
      return newSelection;
    });
  };

  // Check if seat is selected
  const isSeatSelected = (seatId: number) => {
    return selectedSeats.some((s) => s.id === seatId);
  };

  const bookShow = async () => {
    try {
      setIsBooking(true);
      const res = await apiClient.post(`/bookings`, {
        showId: data.showId,
        seats: selectedSeats.map((seat) => seat.id),
      });
      router.replace(res.data.data.checkoutUrl);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
    }
    setIsBooking(false);
  };

  // Get seat status for rendering
  const getSeatStatus = (
    seat: Seat & { bookStatus: string },
  ): "Normal" | "AVAILABLE" | "BOOKED" | "Selected" | "Blocked" => {
    if (isSeatSelected(seat.id)) return "Selected";
    return seat.bookStatus as
      | "Normal"
      | "AVAILABLE"
      | "BOOKED"
      | "Selected"
      | "Blocked";
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#1a0a0d] via-slate-950 to-black rounded-2xl overflow-hidden border border-rose-500/20 shadow-2xl shadow-rose-500/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2a0f14] to-[#1a0a0d] border-b border-rose-500/20 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <Armchair className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Select Seats</h3>
              <p className="text-xs text-rose-200/60">
                {data.showinfo.show.auditorium_name} •{" "}
                {selectedDate && selectedTime
                  ? `${selectedDate} at ${selectedTime}`
                  : data.showinfo.show.theatre_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-white/10 text-slate-400"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <span className="text-[10px] text-slate-500 w-8 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-white/10 text-slate-400"
                onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-white/10 text-slate-400"
                onClick={() => setZoom(1)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>

            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 px-4 py-3 bg-black/30 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t-md rounded-b-sm bg-emerald-500/30 border border-emerald-500/50" />
          <span className="text-[10px] text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t-md rounded-b-sm bg-rose-500 border border-rose-400" />
          <span className="text-[10px] text-slate-400">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t-md rounded-b-sm bg-zinc-800/50 border border-zinc-700/50" />
          <span className="text-[10px] text-slate-400">Sold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-lg bg-emerald-500/30 border border-emerald-500/50 ring-1 ring-blue-400/50 flex items-center justify-center">
            <Accessibility className="w-2.5 h-2.5 text-emerald-100" />
          </div>
          <span className="text-[10px] text-slate-400">Wheelchair</span>
        </div>
        <div className="h-3 w-px bg-white/10 hidden sm:block" />
        {data.showinfo.tickets.map((ticket) => (
          <Badge
            key={ticket.seatType}
            variant="outline"
            className={cn(
              "text-[10px] px-2 py-0 h-5 font-normal",
              ticket.seatType === SeatType.REGULAR &&
                "bg-emerald-500/20 hover:bg-emerald-500/40 border-emerald-500/50 text-emerald-100",
              ticket.seatType === SeatType.REGULAR_WHEELCHAIR_ACCESSIBLE &&
                "border-amber-500/40 text-amber-300 bg-amber-500/10",
              ticket.seatType === "Silver" &&
                "border-slate-400/40 text-slate-300 bg-slate-500/10",
            )}
          >
            {ticket.seatType}: {formatPrice(ticket.priceCents / 100)}
          </Badge>
        ))}
      </div>

      {/* Screen */}
      <div className="relative px-4 pt-5 pb-3">
        <div className="relative mx-auto max-w-2xl">
          <div className="h-1.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-6 w-3/4 bg-gradient-to-b from-rose-400/15 to-transparent blur-md" />
          <p className="text-center text-[10px] text-rose-300/50 mt-2 uppercase tracking-[0.25em]">
            Screen this way
          </p>
        </div>
      </div>

      {/* Seat Map */}
      <div className="overflow-x-auto overflow-y-hidden px-2 sm:px-4 py-4 max-h-[45vh] sm:max-h-[50vh]">
        <div
          className="min-w-fit mx-auto transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          <div className="flex flex-col gap-1 items-center">
            {rows.map((row) => (
              <div key={row.row} className="flex items-center gap-0.5 sm:gap-1">
                {/* Row Label - Left */}
                <div
                  className="w-5 sm:w-6 h-6 flex items-center justify-center text-[10px] sm:text-xs font-medium text-rose-300/50"
                  style={{
                    marginTop: `${
                      (row.seats[0]?.seat?.columnOffset || 0) * 24
                    }px`,
                  }}
                >
                  {row.row}
                </div>

                {/* Seats */}
                <div className="flex gap-0.5 sm:gap-1">
                  {row.seats.map((seat) => {
                    const status = seat.seat
                      ? getSeatStatus(
                          seat.seat as Seat & { bookStatus: string },
                        )
                      : "Normal";
                    const statusStyle = seatStatusColors[status];

                    const isAccessible =
                      seat.seat?.seatType ===
                      SeatType.REGULAR_WHEELCHAIR_ACCESSIBLE;

                    return (
                      <button
                        key={seat.seat ? seat.seat.id : seat.key}
                        onClick={() => {
                          if (loggedUser) {
                            handleSeatSelect(
                              seat.seat as Seat & { bookStatus: string },
                            );
                          } else {
                            router.push("/signin");
                          }
                        }}
                        onMouseEnter={() => setHoveredSeat(seat.seat!)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        disabled={status === "BOOKED" || status === "Blocked"}
                        className={cn(
                          "w-6 h-6  border text-[9px] sm:text-[10px] transition-all duration-150",
                          "flex items-center justify-center",
                          isAccessible
                            ? "rounded-lg" // More rounded for accessible seats
                            : "rounded-t-md rounded-b-sm",
                          statusStyle.bg,
                          statusStyle.text,
                          statusStyle.cursor,
                          isAccessible &&
                            status !== "BOOKED" &&
                            status !== "Blocked" &&
                            "ring-1 ring-blue-400/50", // Blue ring for accessible seats
                          status === "Selected" &&
                            "ring-2 ring-rose-400/50 ring-offset-1 ring-offset-slate-950 scale-105",
                          (status === "Normal" || status === "AVAILABLE") &&
                            "hover:scale-110 hover:z-10",
                        )}
                        style={{
                          marginTop: `${(seat.seat?.columnOffset || 0) * 24}px`,
                          marginLeft: `${
                            seat.seat?.rowOffset
                              ? seat.seat.rowOffset * 24 +
                                (row.seats.indexOf(seat) === 0 ? 0 : 4)
                              : 0 || 0
                          }px`,
                        }}
                        title={`${seat.seat?.row} - ${seat.seat?.number}${
                          isAccessible ? " (Wheelchair Accessible)" : ""
                        } - ${status}`}
                      >
                        {isAccessible ? (
                          <Accessibility className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        ) : (
                          seat.seat?.number
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Row Label - Right */}
                <div
                  className="w-5 sm:w-6 h-6 flex items-center justify-center text-[10px] sm:text-xs font-medium text-rose-300/50"
                  style={{
                    marginTop: `${
                      (row.seats[0]?.seat?.columnOffset || 0) * 24
                    }px`,
                  }}
                >
                  {row.row}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hovered Seat Tooltip */}
      {hoveredSeat && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-sm border border-rose-500/30 rounded-lg px-3 py-1.5 shadow-xl">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-white">
              {hoveredSeat.row} - {hoveredSeat.number}
            </span>
            {hoveredSeat.seatType ===
              SeatType.REGULAR_WHEELCHAIR_ACCESSIBLE && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-blue-400 flex items-center gap-1">
                  <Accessibility className="w-3 h-3" />
                  Wheelchair
                </span>
              </>
            )}
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{hoveredSeat.seatType}</span>
          </div>
        </div>
      )}

      {/* Selection Summary & Checkout - Sticky Footer */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[#1a0a0d] via-[#1a0a0d]/98 to-transparent backdrop-blur-sm border-t border-rose-500/20 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Selected Seats */}
          <div className="flex-1 min-w-0">
            {selectedSeats.length > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-rose-400" />
                  <span className="text-sm text-slate-300">
                    {selectedSeats.length} seat
                    {selectedSeats.length > 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedSeats.map((seat) => (
                    <Badge
                      key={seat.id}
                      className="bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 cursor-pointer text-xs px-2 py-0"
                      onClick={() =>
                        handleSeatSelect({
                          ...seat,
                          bookStatus:
                            data.seats.find((s) => s.id === seat.id)
                              ?.bookStatus ?? "AVAILABLE",
                        })
                      }
                    >
                      {seat.number}
                      <X className="w-3 h-3 ml-1 opacity-60" />
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500">
                <Info className="w-4 h-4" />
                <span className="text-xs sm:text-sm">
                  Tap seats to select (max {maxSeats})
                </span>
              </div>
            )}
          </div>

          {/* Total & Checkout */}
          <div className="flex items-center gap-3 sm:gap-4">
            {selectedSeats.length > 0 && (
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Total
                </p>
                <p className="text-lg sm:text-xl font-bold text-white">
                  {formatPrice(totalPrice)}
                </p>
              </div>
            )}
            <Button
              onClick={bookShow}
              size="lg"
              disabled={selectedSeats.length === 0 || isBooking}
              className={cn(
                "px-5 sm:px-6 h-11 font-semibold transition-all rounded-xl",
                selectedSeats.length > 0
                  ? "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white shadow-lg shadow-rose-500/25"
                  : "bg-slate-800 text-slate-500",
              )}
            >
              <Ticket className="w-4 h-4 mr-2" />
              Proceed to Pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Accordion wrapper component
interface SeatSelectionAccordionProps {
  data: HallLayoutData;
  selectedTime: string;
  selectedDate: string;
  onSelectionChange?: (seats: Seat[]) => void;
  maxSeats?: number;
}

export const SeatSelectionAccordion = ({
  data,
  selectedTime,
  selectedDate,
  onSelectionChange,
  maxSeats = 10,
}: SeatSelectionAccordionProps) => {
  const [isOpen, setIsOpen] = useState(true); // Start open when time is selected

  return (
    <div className="mt-6 rounded-2xl border border-rose-500/20 overflow-hidden bg-gradient-to-b from-[#1a0a0d] to-black">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-rose-500/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
            <Armchair className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-white">
              {selectedTime} • {selectedDate}
            </h3>
            <p className="text-xs text-rose-200/60">
              {data.showinfo.show.theatre_name} •{" "}
              {data.showinfo.show.auditorium_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-rose-500/40 text-rose-300 bg-rose-500/10 hidden sm:flex"
          >
            {data.showinfo.tickets[0] &&
              `From ${formatPrice(data.showinfo.tickets[0].priceCents / 100)}`}
          </Badge>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-rose-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-rose-400" />
          )}
        </div>
      </button>

      {/* Accordion Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="border-t border-rose-500/20">
          <HallLayout
            data={data}
            onSelectionChange={onSelectionChange}
            maxSeats={maxSeats}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

// Helper function for formatting price outside component
const formatPrice = (price: number) => {
  return `$${price.toLocaleString()}`;
};

export default HallLayout;
