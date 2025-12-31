import React, { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import apiClient from "@/lib/axios";

interface AddMovieProps {
  onClose: () => void;
  onAdd: () => void;
  movieId?: number;
}
interface MovieFormError {
  title?: string;
  description?: string;
  durationMin?: string;
  language?: string;
  releaseDate?: string;
  trailerUrl?: string;
  genres?: string;
  casts?: string;
  director?: string;
  rating?: string;
}
interface Movie {
  title: string;
  description: string;
  durationMin: number | "";
  language: string;
  releaseDate: string;
  trailerUrl: string;
  genres: string;
  casts: string;
  director: string;
  rating: string;
}
const AddMovieModal: React.FC<AddMovieProps> = ({
  onClose,
  onAdd,
  movieId,
}) => {
  const [movieValue, setMovieValue] = useState<Movie>({
    title: "",
    description: "",
    durationMin: "",
    language: "",
    releaseDate: "",
    trailerUrl: "",
    genres: "",
    casts: "",
    director: "",
    rating: "",
  });
  const [formError, setFormError] = useState<MovieFormError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "durationMin") {
      setMovieValue((prev) => ({
        ...prev,
        durationMin: value === "" ? "" : Number(value),
      }));
    } else {
      setMovieValue((prev) => ({ ...prev, [name]: value }));
    }
  };
  const validateForm = (): boolean => {
    const errors: MovieFormError = {};
    if (!movieValue.title.trim()) errors.title = "Movie Title is Required";
    if (!movieValue.description.trim())
      errors.description = "Movie Description is Required";
    if (!movieValue.trailerUrl.trim())
      errors.trailerUrl = "Movie Trailer is Required";
    if (movieValue.durationMin === "" || movieValue.durationMin <= 0) {
      errors.durationMin = "Movie Duration is Required";
    }
    if (!movieValue.genres.trim()) errors.genres = "Movie Genre is Required";
    if (!movieValue.language.trim())
      errors.language = "Movie Language is Required";
    if (!movieValue.director.trim())
      errors.director = "Movie Director is Required";
    if (!movieValue.casts.trim()) errors.casts = "Movie Casts is Required";
    if (!movieValue.rating.trim()) errors.rating = "Movie Ratings is Required";

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const submitMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setApiError("");

    if (validateForm()) {
      setLoading(true);
      try {
        const payload = {
          ...movieValue,
          releaseDate: new Date(movieValue.releaseDate).toISOString(),
        };
        await apiClient.post(`/admin/movies`, {
          payload,
        });
        setSuccessMessage(`Movie created successfully!`);
        setTimeout(() => {
          setFormError(null);
          setMovieValue({
            title: "",
            description: "",
            releaseDate: "",
            genres: "",
            language: "",
            trailerUrl: "",
            durationMin: "",
            director: "",
            casts: "",
            rating: "",
          });
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
    <div className="fixed inset-0 z-50 bg-black/80 p-2 sm:p-4">
      <div className="flex h-full w-full items-end sm:items-center justify-center">
        <div
          className="bg-white shadow-xl w-full sm:max-w-4xl 
                    h-[92vh] sm:h-auto sm:max-h-[90vh]
                    overflow-y-auto
                    rounded-t-2xl sm:rounded-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {movieId ? "Edit" : "Add"} Movie
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form className="space-y-4 p-4" onSubmit={submitMovie}>
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
                Movie Title
              </label>
              <Input
                type="text"
                name="title"
                onChange={handleInputChange}
                placeholder="Enter Movie Title"
                value={movieValue.title}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {formError?.title && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {formError.title}
                </div>
              )}
            </div>
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Movie Description
              </label>
              <Textarea
                name="description"
                rows={6}
                onChange={handleInputChange}
                placeholder="Enter Movie Descriptin"
                value={movieValue.description}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {formError?.description && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {formError.description}
                </div>
              )}
            </div>
            <div className="flex gap-4 justify-between">
              <div className="mb-4 space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Language
                </label>
                <Input
                  type="text"
                  name="language"
                  onChange={handleInputChange}
                  placeholder="Enter Movie language"
                  value={movieValue.language}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                {formError?.language && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formError.language}
                  </div>
                )}
              </div>
              <div className="mb-4 space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Genre
                </label>
                <Input
                  type="text"
                  name="genres"
                  onChange={handleInputChange}
                  placeholder="Enter Movie genre"
                  value={movieValue.genres}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                {formError?.genres && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formError.genres}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-between">
              <div className="mb-4 space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Relsease Date
                </label>
                <Input
                  type="date"
                  name="releaseDate"
                  onChange={handleInputChange}
                  placeholder="Enter Movie Duration in Minute"
                  value={movieValue.releaseDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                {formError?.releaseDate && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formError.releaseDate}
                  </div>
                )}
              </div>
              <div className="mb-4 space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Duration
                </label>
                <Input
                  type="number"
                  name="durationMin"
                  onChange={handleInputChange}
                  placeholder="Enter Movie Duration in Minute"
                  value={movieValue.durationMin}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                {formError?.durationMin && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formError.durationMin}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 space-y-2 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Movie Casts
              </label>
              <Input
                type="text"
                name="casts"
                onChange={handleInputChange}
                placeholder="e.g. John David, Mira Smith"
                value={movieValue.casts}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {formError?.casts && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {formError.casts}
                </div>
              )}
            </div>
            <div className="flex gap-4 justify-between">
              <div className="mb-4 space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Director
                </label>
                <Input
                  type="text"
                  name="director"
                  onChange={handleInputChange}
                  placeholder="e.g. James Cameeron"
                  value={movieValue.director}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                {formError?.director && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formError.director}
                  </div>
                )}
              </div>
              <div className="mb-4 space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Rating
                </label>
                <Input
                  type="number"
                  name="rating"
                  max={5}
                  min={1}
                  onChange={handleInputChange}
                  placeholder="Enter Movie Rating from 1-5"
                  value={movieValue.rating}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                {formError?.rating && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formError.rating}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Movie Trailer
              </label>
              <Input
                type="text"
                name="trailerUrl"
                onChange={handleInputChange}
                placeholder="Enter Movie Trailer URL"
                value={movieValue.trailerUrl}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {formError?.trailerUrl && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {formError.trailerUrl}
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
                <>{movieId ? "Updating..." : "Adding..."}</>
              ) : (
                `${movieId ? "Edit" : "Add"} Movie`
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMovieModal;
