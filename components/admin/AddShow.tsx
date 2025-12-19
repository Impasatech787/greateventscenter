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
import { se } from "date-fns/locale";
import { X } from "lucide-react";
import { Input } from "../ui/input";
interface ShowProps {
  onClose: () => void;
  onAdd: () => void;
  showId?: number;
}
interface ShowForm {
  movieId: string;
  auditoriumId: string;
  startAt: string;
}
interface ShowFormError {
  movieId?: string;
  auditoriumId?: string;
  startAt?: string;
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
const AddShow: React.FC<ShowProps> = ({ onClose, onAdd, showId }) => {
  const [form, setForm] = React.useState<ShowForm>({
    movieId: "",
    auditoriumId: "",
    startAt: "",
  });
  const [formError, setFormError] = useState<ShowFormError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [auditoriumsList, setAuditoriumsList] = useState<Auditorium[]>([]);

  const fetchMovies = async (): Promise<Movie[]> => {
    // Fetch movies logic here
    try {
      const token = localStorage.getItem("authToken") || "";
      const res = await fetch("/api/admin/movies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };
  const fetchAuditoriums = async (): Promise<Auditorium[]> => {
    // Fetch auditoriums logic here
    try {
      const token = localStorage.getItem("authToken") || "";
      const res = await fetch("/api/admin/auditoriums", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch auditoriums");
      }
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching auditoriums:", error);
      return [];
    }
  };

  useEffect(() => {
    Promise.all([fetchMovies(), fetchAuditoriums()]).then(
      ([movies, auditoriums]) => {
        setMoviesList(movies);
        setAuditoriumsList(auditoriums);
      }
    );
  }, []);

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
      const token = localStorage.getItem("authToken") || "";
      const res = await fetch("/api/admin/shows", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: parseInt(form.movieId),
          auditoriumId: parseInt(form.auditoriumId),
          startAt: new Date(form.startAt).toISOString(),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setFormError({ general: errorData.error || "Failed to add show" });
        setLoading(false);
        return;
      }
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
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
              Auditorium
            </label>
            <Select
              value={form.auditoriumId}
              onValueChange={(value) => {
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
                <SelectValue placeholder="Select Venue" />
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

          {/* Start At Input Use Calendar Ui from components for date select with time select as well*/}
          <div className="mb-4 space-y-2"></div>
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
