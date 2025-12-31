import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import { show as Show } from "@/app/generated/prisma";
import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
interface ShowProps {
  onClose: () => void;
  onAdd: () => void;
  showId?: number;
}
interface ShowForm {
  movieId: string;
  auditoriumId: string;
  startAt: string;
  showPricing?: ShowPricing[];
}
interface ShowFormError {
  movieId?: string;
  auditoriumId?: string;
  startAt?: string;
  showPricing?: string;
  general?: string;
}
interface Auditorium {
  id: number;
  name: string;
}
interface Movie {
  id: number;
  title: string;
}
interface ShowPricing {
  seatType: string;
  priceCents: number;
}
const AddShow: React.FC<ShowProps> = ({ onClose, onAdd, showId }) => {
  const [form, setForm] = React.useState<ShowForm>({
    movieId: "",
    auditoriumId: "",
    startAt: "",
    showPricing: [],
  });
  const [formError, setFormError] = useState<ShowFormError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [auditoriumsList, setAuditoriumsList] = useState<Auditorium[]>([]);
  const [showSeatingTypes, setShowSeatingTypes] = useState<string[]>([]);
  const fetchShow = async (): Promise<
    (Show & { seatPrices: ShowPricing[] }) | undefined
  > => {
    try {
      const res = await apiClient.get(`/admin/shows/${showId}`);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching show details:", error);
      return undefined;
    }
  };

  const fetchMovies = async (): Promise<Movie[]> => {
    // Fetch movies logic here
    try {
      const res = await apiClient.get<ApiResponse<Movie[]>>(`/admin/movies`);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };
  const fetchAuditoriums = async (): Promise<Auditorium[]> => {
    // Fetch auditoriums logic here
    try {
      const res =
        await apiClient.get<ApiResponse<Auditorium[]>>(`/admin/auditoriums`);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching auditoriums:", error);
      return [];
    }
  };

  useEffect(() => {
    //if showId is present, fetch the show details and populate the form
    if (showId) {
      fetchShow().then((data) => {
        if (data) {
          const utcStart = new Date(data.startAt);
          const adjustedDate = new Date(
            utcStart.getTime() - utcStart.getTimezoneOffset() * 60000,
          );
          console.log(data.seatPrices);
          setForm({
            movieId: data?.movieId?.toString() ?? "",
            auditoriumId: data?.auditoriumId?.toString() ?? "",
            startAt: adjustedDate.toISOString().slice(0, 16),
            showPricing: data?.seatPrices,
          });
          setShowSeatingTypes(data.seatPrices.map((sp) => sp.seatType));
        }
      });
    }
    Promise.all([fetchMovies(), fetchAuditoriums()]).then(
      ([movies, auditoriums]) => {
        setMoviesList(movies);
        setAuditoriumsList(auditoriums);
      },
    );
  }, []);

  const onAuditoriumSelect = async (value: string) => {
    //fetch auditorium to get seat types as we need it for pricing setup
    try {
      const res = await apiClient.get(`/admin/auditoriums/${value}`);
      setShowSeatingTypes(res.data.data.seatTypes);
    } catch (error) {
      console.error("Error fetching auditorium details:", error);
    }
  };

  const validateShowForm = (): boolean => {
    const errors: ShowFormError = {};
    if (!form.movieId) {
      errors.movieId = "Movie is Required";
    }
    if (!form.auditoriumId) {
      errors.auditoriumId = "Auditorium is Required";
    }
    if (!form.startAt) {
      errors.startAt = "Start time is Required";
    }
    // Validate and required pricing for each seat type
    if (showSeatingTypes.length > 0) {
      if (!form.showPricing || form.showPricing.length === 0) {
        errors.showPricing = "Seat pricing is required";
      } else {
        form.showPricing.forEach((pricing) => {
          //CHECK FOR NEGATIVE OR NAN VALUES OR ZERO
          if (
            pricing.priceCents < 0 ||
            isNaN(pricing.priceCents) ||
            pricing.priceCents === 0
          ) {
            errors.showPricing = "Price cannot be negative or zero";
          }
        });
      }
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const submitShow = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setSuccessMessage("");
    if (!validateShowForm()) {
      setLoading(false);
      return;
    }
    try {
      await apiClient.post(`/admin/shows${showId ? `/${showId}` : ``}`, {
        movieId: parseInt(form.movieId),
        auditoriumId: parseInt(form.auditoriumId),
        startAt: new Date(form.startAt).toISOString(),
        seatPrices: form.showPricing || [],
      });
      setSuccessMessage("Show added successfully");
      setLoading(false);
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error adding show:", error);
      setFormError({ general: "Server error" });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {showId ? "Edit" : "Add"} Show
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4 p-4" onSubmit={submitShow}>
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* API Error Message */}
          {formError?.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {formError.general}
            </div>
          )}

          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Movie
            </label>
            <Select
              value={form.movieId}
              onValueChange={(value) => {
                setForm((prev) => ({ ...prev, movieId: value }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Movie" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Movie Name</SelectLabel>
                  {moviesList.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id.toString()}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formError?.movieId && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formError.movieId}
              </div>
            )}
          </div>

          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auditorium
            </label>
            <Select
              value={form.auditoriumId}
              onValueChange={(value) => {
                onAuditoriumSelect(value);
                setForm((prev) => ({ ...prev, auditoriumId: value }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Auditorium Name</SelectLabel>
                  {auditoriumsList.map((auditorium) => (
                    <SelectItem
                      key={auditorium.id}
                      value={auditorium.id.toString()}
                    >
                      {auditorium.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formError?.auditoriumId && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formError.auditoriumId}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2 px-2">
            {showSeatingTypes?.length > 0 && (
              <div className="">
                <label className="block text-sm font-medium mb-2">
                  Seat Pricing
                </label>
              </div>
            )}
            {showSeatingTypes?.map((seatType) => (
              <div
                key={seatType}
                className="flex items-center justify-between mb-1"
              >
                <span className="w-32 font-medium">{seatType}</span>
                <Input
                  type="number"
                  placeholder="Price in cents"
                  className="flex-1 max-w-32"
                  value={
                    form.showPricing?.find((sp) => sp.seatType === seatType)
                      ?.priceCents || ""
                  }
                  onChange={(e) => {
                    const priceCents = parseInt(e.target.value) || 0;
                    setForm((prev) => {
                      const existingPricing = prev.showPricing || [];
                      const updatedPricing = existingPricing.filter(
                        (sp) => sp.seatType !== seatType,
                      );
                      updatedPricing.push({ seatType, priceCents });
                      return { ...prev, showPricing: updatedPricing };
                    });
                  }}
                />
              </div>
            ))}{" "}
            {formError?.showPricing && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formError.showPricing}
              </div>
            )}
          </div>

          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start At
            </label>
            <Input
              type="datetime-local"
              value={form.startAt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startAt: e.target.value }))
              }
            />
            {formError?.startAt && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formError.startAt}
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
              <>{showId ? "Updating..." : "Adding..."}</>
            ) : (
              `${showId ? "Edit" : "Add"} Show`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddShow;
