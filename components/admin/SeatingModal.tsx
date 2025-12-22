import { SeatType } from "@/app/generated/prisma";
import { cn } from "@/lib/utils";
import { Accessibility, Trash, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import AddSeatModal, { ValidSeatForm } from "./AddSeatModal";
const SeatSize = 24;
interface Seat {
  id?: number;
  auditoriumId: number;
  row: string;
  number: string;
  seatType: SeatType;
  columnOffset: number;
  rowOffset: number;
}
interface SeatingProps {
  onClose: () => void;
  audiId?: number;
}
export interface SeatCell {
  // kind: "seat" | "empty";
  key: string; // stable key for HTML rendering
  seat?: Seat;
}
interface SeatRow {
  row: string;
  seats: SeatCell[];
}

const SeatingModal: React.FC<SeatingProps> = ({ audiId, onClose }) => {
  const [seats, setSeats] = useState<SeatRow[]>([]);
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selectedSeats, setSelectedSeats] = useState<Set<SeatCell>>(new Set());
  const [isAddingSeat, setIsAddingSeat] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [addSeatRowLabel, setAddSeatRowLabel] = useState<string>("");

  const fetchSeatings = async () => {
    try {
      const token = localStorage.getItem("authToken") || "";
      const res = await fetch(`/api/admin/seats?auditoriumId=${audiId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed TO get Seats");
      } else {
        const data = await res.json();
        const rows = formatSeats(data.data);
        console.log("Formatted Seats: ", rows);
        setSeats(rows);
      }
    } catch (error) {
      console.error(`Error ${error}`);
    }
  };
  useEffect(() => {
    fetchSeatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectSeat = (seat: SeatCell) => {
    setIsSelectMode(true);
    setSelectedSeats((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(seat)) {
        newSelected.delete(seat);
      } else {
        newSelected.add(seat);
      }
      return newSelected;
    });
  };

  const deleteSelectedSeats = () => {
    setSeats((prevSeats) =>
      prevSeats.map((row) => ({
        ...row,
        seats: row.seats.filter((seat) => !selectedSeats.has(seat)),
      }))
    );
    setSelectedSeats(new Set());
    setIsSelectMode(false);
  };

  const addSeat = (row: SeatRow, num: number) => {
    {
      /* Add logic to add seats to the specified row 
    For that also the AddSeatModal component logic need to be updated
    were we can pass a prop to indicate that we are adding seat to existing row
    and then in the onSubmit function of that modal we can handle the addition of seat to that row
       */
    }
    console.log("Add seat to row: ", row, " at number: ", num);
    setIsAddingSeat(true);
    setAddSeatRowLabel(row.row);
  };

  const addNewRow = async (payload: ValidSeatForm) => {
    {
      /* Add logic to add new row of seats based on payload 
    Befor that we need to get the newrowlabel which is the value of last row +1 
    the newrowlabel is the value to be place in fromRow and toRow in the payload
      */
    }
    try {
      setIsSubmitting(true);

      //get new row label when creating new row
      const rowLabel = addSeatRowLabel
        ? addSeatRowLabel
        : String.fromCharCode(
            seats.length > 0
              ? seats[seats.length - 1].row.charCodeAt(0) + 1
              : "A".charCodeAt(0)
          );
      let fromNumber = 0;

      //if adding to existing row, get the last seat number in that row
      if (rowLabel != "") {
        fromNumber = seats.find((r) => r.row === rowLabel)?.seats.length || 0;
      }

      //if payload contains number of rows more than 1, we need to adjust the fromRow and toRow accordingly
      const toRowLabel =
        payload.numberOfRow && payload.numberOfRow > 1
          ? String.fromCharCode(
              rowLabel.charCodeAt(0) + payload.numberOfRow - 1
            )
          : rowLabel;

      console.log(
        "Adding seats to row: ",
        rowLabel,
        "to row: ",
        toRowLabel,
        " from number: ",
        fromNumber
      );

      //if rolabel is there then we need to get the cloumnoffset of any existing seat in that row
      if (addSeatRowLabel) {
        const existingRow = seats.find((r) => r.row === addSeatRowLabel);
        if (existingRow) {
          const existingSeat = existingRow.seats[0];
          if (existingSeat && existingSeat.seat) {
            console.log(
              "Existing Seat Offset: ",
              existingSeat.seat.columnOffset
            );

            payload.columnOffset = existingSeat.seat.columnOffset;
          }
        }
      }
      console.log("Payload to send: ", payload);

      const token = localStorage.getItem("authToken") || "";
      const payloadToSend = {
        auditoriumId: audiId,
        fromRow: rowLabel,
        toRow: toRowLabel,
        fromNumber: fromNumber + 1,
        toNumber: fromNumber + payload.numberOfSeat,
        rowOffset: payload.rowOffset,
        columnOffset: payload.columnOffset,
        seatType: payload.seatType,
      };
      const res = await fetch("/api/admin/seats/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadToSend),
      });
      if (!res.ok) {
        throw new Error("Failed to add Seats");
      } else {
        fetchSeatings();
      }
    } catch (error) {
      console.error(`Error ${error}`);
    } finally {
      setAddSeatRowLabel("");
      setIsSubmitting(false);
      setIsAddingSeat(false);
    }
  };

  const onSeatTypeChange = (type: SeatType) => {
    // Logic to change seat type for selected seats
    // setSeats((prevSeats) =>
    //   prevSeats.map((row) => ({
    //     ...row,
    //     seats: row.seats.map((seat) => {
    //       if (selectedSeats.has(seat) && seat.kind === "seat" && seat.seat) {
    //         return {
    //           ...seat,
    //           seat: {
    //             ...seat.seat,
    //             seatType: type,
    //           },
    //         };
    //       }
    //       return seat;
    //     }),
    //   }))
    // );
  };

  const onSeatKindChange = (kind: "seat" | "empty") => {
    setSeats((prevSeats) =>
      prevSeats.map((row) => ({
        ...row,
        seats: row.seats.map((seat) => {
          if (selectedSeats.has(seat)) {
            return {
              ...seat,
              kind: kind,
            };
          }
          return seat;
        }),
      }))
    );
  };

  const formatSeats = (seats: Seat[]) => {
    const byRow = new Map<string, Seat[]>();

    for (const s of seats) {
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
  };
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Manage Auditorium Seating
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSelectMode && (
          <div className="px-8 py-4  border-b border-gray-200 bg-gray-50">
            <h2 className="text-md font-semibold mb-2">Manage Selected Seat</h2>
            <div className="flex gap-4 items-center">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Seat Type
                </label>
                <Select
                  onValueChange={(value) => onSeatTypeChange(value as SeatType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Seat Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SeatType.REGULAR}>Regular</SelectItem>
                    <SelectItem value={SeatType.REGULAR_WHEELCHAIR_ACCESSIBLE}>
                      Wheel Chair Accessible
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Seat Kind
                </label>
                <Select
                  onValueChange={(value) =>
                    onSeatKindChange(value as "seat" | "empty")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Seat Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seat">Seat</SelectItem>
                    <SelectItem value="empty">Empty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Actions
                </label>
                <Button
                  onClick={deleteSelectedSeats}
                  className="bg-red-500 text-white hover:bg-red-600"
                  title="Delete Selected Seats"
                >
                  <Trash />{" "}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Screen Indicator */}
        <div className="relative px-4 pt-5 pb-3">
          <div className="relative mx-auto max-w-2xl">
            <div className="h-1.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-6 w-3/4 bg-gradient-to-b from-rose-400/15 to-transparent blur-md" />
            <p className="text-center text-[10px] text-black mt-2 uppercase tracking-[0.25em]">
              Screen this way
            </p>
          </div>
        </div>

        {/* Seat Map */}
        <div className="overflow-x-auto overflow-y-auto px-2 sm:px-4 py-4 max-h-[45vh] sm:max-h-[50vh] min-h-[50vh]">
          <div
            className="min-w-fit mx-auto transition-transform duration-200"
            style={{ transform: `scale(${1})`, transformOrigin: "top center" }}
          >
            <div className="flex flex-col gap-2 items-center justify-center">
              {seats.map((row) => (
                <div
                  key={row.row}
                  className="flex items-center justify-center  gap-2"
                >
                  {/* Row Label - Left */}
                  <div
                    className="w-5 sm:w-6 h-6 flex items-center justify-center text-[10px] sm:text-xs font-medium"
                    style={{
                      marginTop: `${
                        (row.seats[0]?.seat?.columnOffset || 0) * SeatSize
                      }px`,
                    }}
                  >
                    {row.row}
                  </div>

                  {/* Seats */}
                  <div className="flex gap-1">
                    {row.seats.map((seat) => {
                      const isSelected = selectedSeats.has(seat);
                      const isAccessible =
                        seat.seat?.seatType ===
                        SeatType.REGULAR_WHEELCHAIR_ACCESSIBLE;
                      return (
                        <button
                          title={`${seat.seat?.row} - ${seat.seat?.number}`}
                          key={`${seat.seat?.row}-${seat.seat?.number}-${
                            seat.seat?.id ? seat.seat.id : "new"
                          }`}
                          onClick={() => selectSeat(seat)}
                          style={{
                            marginTop: `${
                              (seat.seat?.columnOffset || 0) * SeatSize
                            }px`,
                            marginLeft: `${
                              seat.seat?.rowOffset
                                ? seat.seat.rowOffset * SeatSize +
                                  (row.seats.indexOf(seat) === 0 ? 0 : 4)
                                : 0 || 0
                            }px`,
                          }}
                          className={cn(
                            "w-6 h-6  border-2 text-[9px] sm:text-[10px] transition-all duration-150",
                            "flex items-center justify-center",
                            isSelected
                              ? "bg-rose-400/20 border-rose-400"
                              : "bg-white border-gray-300 hover:border-rose-400",

                            isAccessible
                              ? "rounded-lg" // More rounded for accessible seats
                              : "rounded-t-md rounded-b-sm"
                          )}
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
                  <button
                    title="Add Section"
                    onClick={() =>
                      addSeat(
                        row,
                        row.seats[row.seats.length - 1]
                          ? Number(
                              row.seats[row.seats.length - 1].seat?.number || 0
                            ) + 1
                          : 1
                      )
                    }
                    className="w-6 h-6 sm:w-7 sm:h-7 border rounded hover:border-green-300 text-[9px] sm:text-[10px] transition-all duration-150"
                    style={{
                      marginTop: `${
                        (row.seats[0]?.seat?.columnOffset || 0) * SeatSize
                      }px`,
                    }}
                  >
                    +
                  </button>
                </div>
              ))}
              <div className="flex justify-between items-center w-full gap-4 relative">
                <button
                  onClick={() => setIsAddingSeat(true)}
                  className="w-full border-2 rounded-lg border-gray-300 p-1 hover:border-green-400 text-sm mt-4"
                >
                  Add New Row
                </button>
              </div>
            </div>
          </div>
        </div>
        {isAddingSeat && (
          <AddSeatModal
            onClose={() => {
              setIsAddingSeat(false);
              setAddSeatRowLabel("");
            }}
            onSubmit={addNewRow}
            isLoading={isSubmitting}
            rowLabel={addSeatRowLabel}
          />
        )}

        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button className="bg-green-500 text-white">Save Changes</Button>
          <Button variant="outline" onClick={onClose} className="ml-2">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatingModal;
