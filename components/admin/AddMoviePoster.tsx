import { X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";

interface ModalProps {
  movieId: number;
  onClose: () => void;
  posterUrl: string;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

const AddMoviePoster: React.FC<ModalProps> = ({
  movieId,
  onClose,
  posterUrl,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [fieldError, setFieldError] = useState<string>("");

  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isEdit = Boolean(posterUrl != "");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    return () => {};
  }, []);

  const accepted = useMemo(() => ALLOWED_TYPES.join(","), []);

  const resetMessages = () => {
    setSuccessMessage("");
    setApiError("");
    setFieldError("");
  };

  const clearSelectedFile = () => {
    setPosterFile(null);
    setPreviewUrl("");
    resetMessages();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type as any)) {
      return "Please upload a valid image (PNG, JPEG, WebP, or GIF).";
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleOnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetMessages();

    const file = e.target.files?.[0];
    if (!file) {
      setFieldError("Please choose an image file.");
      return;
    }

    const err = validateFile(file);
    if (err) {
      setPosterFile(null);
      setPreviewUrl("");
      setFieldError(err);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPosterFile(file);
      setPreviewUrl(reader.result as string);
      setFieldError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!posterFile) {
      setFieldError("Poster image is required.");
      return;
    }

    const err = validateFile(posterFile);
    if (err) {
      setFieldError(err);
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", posterFile);

      const token = localStorage.getItem("authToken") || "";
      const res = await fetch(`/api/admin/movies/${movieId}/poster`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        let message = "Failed to upload movie poster.";
        try {
          const data = await res.json();
          message = data?.message || data?.error || message;
        } catch {}
        throw new Error(message);
      }

      setSuccessMessage("Poster uploaded successfully.");
      setApiError("");
      setFieldError("");
      // Optionally clear file selection after success:
      clearSelectedFile();
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (err: any) {
      setApiError(err?.message || "Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // close when clicking outside the modal content
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit" : "Add"} Movie Poster
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form className="space-y-4 px-5 py-4" onSubmit={handleSubmit}>
          {/* Success */}
          {successMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {successMessage}
            </div>
          )}

          {/* API Error */}
          {apiError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {apiError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">
              Poster Image <span className="text-red-600">*</span>
            </label>

            <Input
              ref={fileInputRef as any}
              type="file"
              accept={accepted}
              onChange={handleOnFileChange}
              disabled={isUploading}
            />

            {/* Field Error */}
            {fieldError && <p className="text-sm text-red-600">{fieldError}</p>}

            <p className="text-xs text-gray-500">
              Allowed: PNG, JPEG, WebP, GIF • Max {MAX_FILE_SIZE_MB}MB
            </p>
          </div>

          {/* Preview */}
          {previewUrl || posterUrl ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800">Preview</p>
              <div className="overflow-hidden rounded-lg border bg-gray-50">
                <img
                  src={posterFile ? previewUrl : posterUrl}
                  alt="Poster preview"
                  className="h-64 w-full object-contain"
                />
              </div>
              {previewUrl && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearSelectedFile}
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                    disabled={isUploading}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
              Select an image to see a preview here.
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              disabled={isUploading || !posterFile}
            >
              {isUploading ? "Uploading..." : "Upload Poster"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMoviePoster;
