import React, { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import { useApi } from "@/hooks/useApi";

interface AddEventVenueProps {
  onClose: () => void;
  onAdd?: () => void;
  venueId?: number;
}
interface VenueFormError {
  name?: string;
  location?: string;
  general?: string;
}
const AddEventVenueModal: React.FC<AddEventVenueProps> = ({
  onClose,
  onAdd,
  venueId,
}) => {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [formError, setFormError] = useState<VenueFormError | null>(null);
  const { data, call, loading } = useApi();

  const validateForm = (): boolean => {
    const errors: VenueFormError = {};

    if (!name.trim()) {
      errors.name = "Venue Name is Required";
    }
    if (!location.trim()) {
      errors.location = "Venue Location is Required";
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const submitVenue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const token = localStorage.getItem("authToken") || "";
      call("/api/admin/cinemas", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, location }),
      });
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {venueId ? "Edit" : "Add"} Venue
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4 p-4" onSubmit={submitVenue}>
          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Name
            </label>
            <Input
              type="text"
              placeholder="Enter Venue Name"
              value={name}
              onChange={(e) => {
                e.preventDefault();
                setName(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formError?.name && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formError.name}
              </div>
            )}
          </div>
          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Location
            </label>
            <Input
              type="text"
              value={location}
              placeholder="Enter Venue Location"
              onChange={(e) => {
                e.preventDefault();
                setLocation(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formError?.location && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formError.location}
              </div>
            )}
          </div>

          {/* Copy Link Button */}
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-green-600 hover:bg-green-800 text-white font-medium py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {venueId ? "Edit" : "Add"} Venue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddEventVenueModal;
