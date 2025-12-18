import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddAudiProps {
  onClose: () => void;
  onAdd: () => void;
  audiId?: number;
}
interface AudiFormError {
  name?: string;
  venue?: string;
  general?: string;
}
interface Venue {
  id: string;
  name: string;
}
const AddAudiModal: React.FC<AddAudiProps> = ({ onClose, onAdd, audiId }) => {
  const [name, setName] = useState<string>("");
  const [venuesList, setVenuesList] = useState<Venue[] | []>([]);
  const [venue, setVenue] = useState<string>("");
  const [formError, setFormError] = useState<AudiFormError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const token = localStorage.getItem("authToken") || "";

        const res = await fetch("/api/admin/cinemas", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Faild to get Venues List");
        }
        const data = await res.json();
        setVenuesList(data.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const validateForm = (): boolean => {
    const errors: AudiFormError = {};

    if (!name.trim()) {
      errors.name = "Auditorium Name is Required";
    }
    if (!venue) {
      errors.venue = "Venue is Required";
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const submitAudi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setApiError("");

    if (validateForm()) {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken") || "";
        const res = await fetch("/api/admin/auditoriums", {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, cinemaId: Number(venue) }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to Submit Auditorium");
        }
        setSuccessMessage(`Auditorium created successfully!`);
        setTimeout(() => {
          setName("");
          setVenue("");
          setFormError(null);
          onClose();
          onAdd();
        }, 300);
      } catch (error) {
        console.error(error);
        setApiError(`${error}`);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {audiId ? "Edit" : "Add"} Auditorium
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4 p-4" onSubmit={submitAudi}>
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* API Error Message */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {apiError}
            </div>
          )}

          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auditorium Name
            </label>
            <Input
              type="text"
              placeholder="Enter Auditorium Name"
              value={name}
              onChange={(e) => {
                e.preventDefault();
                setName(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {formError?.venue && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formError.venue}
              </div>
            )}
          </div>
          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue
            </label>
            <Select
              value={venue}
              onValueChange={(value) => {
                setVenue(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Venue Name</SelectLabel>
                  {venuesList.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id.toString()}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formError?.name && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formError.name}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            disabled={loading || successMessage !== ""}
            type="submit"
            className="w-full bg-green-600 hover:bg-green-800 text-white font-medium py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>{audiId ? "Updating..." : "Adding..."}</>
            ) : (
              `${audiId ? "Edit" : "Add"} Auditorium`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddAudiModal;
