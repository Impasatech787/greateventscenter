import { SeatType } from "@/app/generated/prisma";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ro } from "date-fns/locale";

interface AddSeatModalProps {
  onClose: () => void;
  onSubmit: (payload: ValidSeatForm) => void; // ideally: (payload: ValidSeatForm) => void
  isLoading?: boolean;
  rowLabel?: string;
}

type NewSeatForm = {
  columnOffset: string; // keep as string for input
  rowOffset: string;
  numberOfSeat: string;
  seatType: SeatType | "";
  numberOfRow?: string;
};

export type ValidSeatForm = {
  columnOffset: number;
  rowOffset: number;
  numberOfSeat: number;
  seatType: SeatType;
  numberOfRow?: number;
};

type FormErrors = Partial<Record<keyof NewSeatForm, string>>;

const isNonNegativeIntString = (v: string) => /^\d+$/.test(v); // "0", "1", "12" etc.

const AddSeatModal: React.FC<AddSeatModalProps> = ({
  onClose,
  onSubmit,
  isLoading,
  rowLabel,
}) => {
  const [newSeatForm, setNewSeatForm] = useState<NewSeatForm>({
    columnOffset: "",
    rowOffset: "",
    numberOfSeat: "",
    seatType: "",
    numberOfRow: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string>("");

  const validate = (form: NewSeatForm): { ok: boolean; errors: FormErrors } => {
    const nextErrors: FormErrors = {};
    {
      /* When adding to existing row, skip columnOffset validation */
    }
    if (!rowLabel && form.columnOffset === "")
      nextErrors.columnOffset = "Gap above is required.";
    if (form.rowOffset === "")
      nextErrors.rowOffset = "Gap on left is required.";
    if (form.numberOfSeat === "")
      nextErrors.numberOfSeat = "Number of seats is required.";
    if (form.seatType === "") nextErrors.seatType = "Seat type is required.";

    if (
      form.columnOffset !== "" &&
      !isNonNegativeIntString(form.columnOffset)
    ) {
      nextErrors.columnOffset =
        "Must be a non-negative whole number (0, 1, 2...).";
    }
    if (form.rowOffset !== "" && !isNonNegativeIntString(form.rowOffset)) {
      nextErrors.rowOffset =
        "Must be a non-negative whole number (0, 1, 2...).";
    }
    if (
      form.numberOfSeat !== "" &&
      !isNonNegativeIntString(form.numberOfSeat)
    ) {
      nextErrors.numberOfSeat = "Must be a whole number (1, 2, 3...).";
    }
    if (form.numberOfSeat !== "" && isNonNegativeIntString(form.numberOfSeat)) {
      const n = Number(form.numberOfSeat);
      if (n < 1) nextErrors.numberOfSeat = "Must be at least 1.";
    }

    return { ok: Object.keys(nextErrors).length === 0, errors: nextErrors };
  };

  const canSubmit = useMemo(() => {
    return (
      (rowLabel ? true : newSeatForm.columnOffset !== "") &&
      newSeatForm.rowOffset !== "" &&
      newSeatForm.numberOfSeat !== "" &&
      newSeatForm.seatType !== ""
    );
  }, [newSeatForm, rowLabel]);

  const handleSeatInputChange = (name: keyof NewSeatForm, value: string) => {
    setNewSeatForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError("");
  };

  const submitSeat = () => {
    const result = validate(newSeatForm);
    setErrors(result.errors);

    if (!result.ok) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    const payload: ValidSeatForm = {
      columnOffset: Number(newSeatForm.columnOffset),
      rowOffset: Number(newSeatForm.rowOffset),
      numberOfSeat: Number(newSeatForm.numberOfSeat),
      seatType: newSeatForm.seatType as SeatType,
      numberOfRow:
        newSeatForm.numberOfRow && newSeatForm.numberOfRow !== ""
          ? Number(newSeatForm.numberOfRow)
          : undefined,
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20">
      <div className="bg-white p-3 max-w-md w-full space-y-3 rounded-md">
        <div className="flex justify-between py-2 items-center border-b border-gray-200">
          <h2 className="text-md font-semibold">
            {rowLabel ? `Add Seats to Row ${rowLabel}` : "Add New Seats"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-7 h-6" />
          </button>
        </div>
        {/* Hide Gap Above// columnofset when adding the seat to existing row */}
        {!rowLabel && (
          <div className="space-y-1">
            <label className="font-medium text-sm">
              Gap Above{" "}
              <span className="ml-1 text-xs text-gray-600">
                (1 Unit for 1 Seat Space)
              </span>
            </label>
            <Input
              type="number"
              min={0}
              step={1}
              value={newSeatForm.columnOffset}
              onChange={(e) =>
                handleSeatInputChange("columnOffset", e.target.value)
              }
            />
            {errors.columnOffset && (
              <div className="text-red-500 text-sm">{errors.columnOffset}</div>
            )}
          </div>
        )}

        <div className="space-y-1">
          <label className="font-medium text-sm">
            Gap on Left{" "}
            <span className="ml-1 text-xs text-gray-600">
              (1 Unit for 1 Seat Space)
            </span>
          </label>
          <Input
            type="number"
            min={0}
            step={1}
            value={newSeatForm.rowOffset}
            onChange={(e) => handleSeatInputChange("rowOffset", e.target.value)}
          />
          {errors.rowOffset && (
            <div className="text-red-500 text-sm">{errors.rowOffset}</div>
          )}
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm">Number of Seat</label>
          <Input
            type="number"
            min={1}
            step={1}
            value={newSeatForm.numberOfSeat}
            onChange={(e) =>
              handleSeatInputChange("numberOfSeat", e.target.value)
            }
          />
          {errors.numberOfSeat && (
            <div className="text-red-500 text-sm">{errors.numberOfSeat}</div>
          )}
        </div>
        <div className="space-y-1">
          <label className="font-medium text-sm">
            Number of Row{" "}
            <span className="ml-1 text-xs text-gray-600">
              (Copy Same Layout to Number of Rows)
            </span>
          </label>
          <Input
            type="number"
            min={1}
            step={1}
            value={newSeatForm.numberOfRow}
            onChange={(e) =>
              handleSeatInputChange("numberOfRow", e.target.value)
            }
          />
          {errors.numberOfRow && (
            <div className="text-red-500 text-sm">{errors.numberOfRow}</div>
          )}
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm">Seat Type</label>
          <Select
            value={newSeatForm.seatType || undefined}
            onValueChange={(value) =>
              handleSeatInputChange("seatType", value as SeatType)
            }
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
          {errors.seatType && (
            <div className="text-red-500 text-sm">{errors.seatType}</div>
          )}
        </div>

        {formError && (
          <div className="text-red-500 mx-1 text-sm">{formError}</div>
        )}

        <Button
          className="w-full"
          onClick={submitSeat}
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? "Adding Seats..." : "Add Seats"}{" "}
        </Button>
      </div>
    </div>
  );
};

export default AddSeatModal;
