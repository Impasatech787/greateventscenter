import React, { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import apiClient from "@/lib/axios";

interface AddEventVenueProps {
  onClose: () => void;
  onAdd: () => void;
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
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    setSuccessMessage("");
    setApiError("");

    if (validateForm()) {
      setLoading(true);
      try {
        const res = await apiClient.post(`/admin/cinemas`, {
          name,
          location,
        });
        if (res) {
          setSuccessMessage(`Venue  created successfully!`);
          setTimeout(() => {
            setName("");
            setLocation("");
            setFormError(null);
            onClose();
            onAdd();
          }, 300);
        }
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
              disabled={loading}
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
              disabled={loading}
            />
            {formError?.location && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formError.location}
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
              <>{venueId ? "Updating..." : "Adding..."}</>
            ) : (
              `${venueId ? "Edit" : "Add"} Venue`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddEventVenueModal;
