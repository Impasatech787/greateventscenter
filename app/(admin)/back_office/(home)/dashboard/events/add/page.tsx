"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cinema as EventVenue } from "@/app/generated/prisma";
import { useApi } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type EventRecord = {
  id: number;
  title: string;
  cinemaId: number;
  cinemaName: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  status: string;
  capacity: number | null;
  priceCents: number | null;
  thumbnailUrl?: string | null;
  description?: string | null;
};

type EventFormState = {
  title: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  status: string;
  capacity: string;
  price: string;
  description: string;
};

const categories = [
  "Conference",
  "Concert",
  "Workshop",
  "Exhibition",
  "Meetup",
  "Fundraiser",
];

const statuses = ["Draft", "Scheduled", "Cancelled"];

const defaultFormState: EventFormState = {
  title: "",
  venueId: "",
  date: "",
  startTime: "",
  endTime: "",
  category: "",
  status: "",
  capacity: "",
  price: "",
  description: "",
};

export default function AddEventPage() {
  const [formState, setFormState] = useState<EventFormState>(defaultFormState);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [pendingThumbnail, setPendingThumbnail] = useState<File | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const cropperImageRef = useRef<HTMLImageElement | null>(null);
  const router = useRouter();
  const cropDragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    dragging: boolean;
  }>({ startX: 0, startY: 0, originX: 0, originY: 0, dragging: false });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const { data, loading, error: venuesError, call } =
    useApi<EventVenue[]>();
  const allowedThumbnailTypes = useMemo(
    () => ["image/png", "image/jpeg", "image/webp", "image/gif"],
    [],
  );
  const cropFrame = useMemo(() => ({ width: 480, height: 270 }), []);

  useEffect(() => {
    const fetchVenues = async () => {
      const token = localStorage.getItem("authToken") || "";
      await call("/api/admin/cinemas", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    };

    fetchVenues();
  }, [call]);

  useEffect(() => {
    const eventId = searchParams.get("id");
    if (!eventId) {
      setEditingId(null);
      return;
    }
    const parsedId = Number(eventId);
    if (Number.isNaN(parsedId)) {
      setError("Invalid event id.");
      setEditingId(null);
      return;
    }

    const fetchEvent = async () => {
      setIsLoadingEvent(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken") || "";
        const response = await fetch(`/api/admin/events/${parsedId}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Event not found. It may have been deleted.");
        }

        const payload = await response.json();
        const eventToEdit = payload.data as EventRecord;
        setEditingId(parsedId);
        setFormState({
          title: eventToEdit.title,
          venueId: String(eventToEdit.cinemaId),
          date: eventToEdit.date,
          startTime: eventToEdit.startTime,
          endTime: eventToEdit.endTime,
          category: eventToEdit.category,
          status: eventToEdit.status,
          capacity:
            eventToEdit.capacity !== null
              ? String(eventToEdit.capacity)
              : "",
          price:
            eventToEdit.priceCents !== null
              ? (eventToEdit.priceCents / 100).toFixed(2)
              : "",
          description: eventToEdit.description ?? "",
        });
        setThumbnailFile(null);
        setThumbnailPreview(eventToEdit.thumbnailUrl ?? null);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load event."
        );
        setEditingId(null);
      } finally {
        setIsLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [searchParams]);

  const updateField = (field: keyof EventFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormState(defaultFormState);
    setError(null);
    setToastMessage(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setPendingThumbnail(null);
    setCropSrc(null);
    setIsCropOpen(false);
    setCropOffset({ x: 0, y: 0 });
    setZoom(1);
    setMinZoom(1);
    setImageSize({ width: 0, height: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!allowedThumbnailTypes.includes(file.type)) {
      setError("Please upload a valid image (PNG, JPEG, WebP, or GIF).");
      return;
    }
    setError(null);
    setPendingThumbnail(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setCropSrc(result);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (
      !formState.title ||
      !formState.venueId ||
      !formState.date ||
      !formState.startTime ||
      !formState.endTime ||
      !formState.category ||
      !formState.status
    ) {
      setError("Please fill out all required fields before saving the event.");
      return;
    }

    const capacity = Number(formState.capacity || 0);
    const price = Number(formState.price || 0);

    if (Number.isNaN(capacity) || capacity < 0) {
      setError("Capacity must be a valid non-negative number.");
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("title", formState.title);
    formPayload.append("cinemaId", formState.venueId);
    formPayload.append("date", formState.date);
    formPayload.append("startTime", formState.startTime);
    formPayload.append("endTime", formState.endTime);
    formPayload.append("category", formState.category);
    formPayload.append("status", formState.status);
    if (formState.capacity) {
      formPayload.append("capacity", formState.capacity);
    }
    if (formState.price) {
      formPayload.append("price", formState.price);
    }
    if (formState.description) {
      formPayload.append("description", formState.description);
    }
    if (thumbnailFile) {
      formPayload.append("thumbnail", thumbnailFile);
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken") || "";
      const response = await fetch(
        editingId ? `/api/admin/events/${editingId}` : "/api/admin/events",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formPayload,
        }
      );

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error ?? "Failed to save event.");
      }

      if (editingId) {
        triggerToastAndRedirect("Event updated.");
        return;
      }

      triggerToastAndRedirect("Your event has been added.");
      setFormState(defaultFormState);
      setThumbnailFile(null);
      setThumbnailPreview(null);
    setPendingThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save event."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const clampOffset = (offset: { x: number; y: number }, scale: number) => {
    const scaledWidth = imageSize.width * scale;
    const scaledHeight = imageSize.height * scale;
    const minX = Math.min(0, cropFrame.width - scaledWidth);
    const minY = Math.min(0, cropFrame.height - scaledHeight);
    const maxX = 0;
    const maxY = 0;
    return {
      x: Math.max(minX, Math.min(maxX, offset.x)),
      y: Math.max(minY, Math.min(maxY, offset.y)),
    };
  };

  const handleCropImageLoad = () => {
    const img = cropperImageRef.current;
    if (!img) return;
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    setImageSize({ width, height });
    const scale = Math.max(cropFrame.width / width, cropFrame.height / height);
    setMinZoom(scale);
    setZoom(scale);
    const initialOffset = {
      x: (cropFrame.width - width * scale) / 2,
      y: (cropFrame.height - height * scale) / 2,
    };
    setCropOffset(clampOffset(initialOffset, scale));
  };

  const handleCropPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    cropDragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: cropOffset.x,
      originY: cropOffset.y,
      dragging: true,
    };
  };

  const handleCropPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!cropDragRef.current.dragging) return;
    const deltaX = event.clientX - cropDragRef.current.startX;
    const deltaY = event.clientY - cropDragRef.current.startY;
    const nextOffset = {
      x: cropDragRef.current.originX + deltaX,
      y: cropDragRef.current.originY + deltaY,
    };
    setCropOffset(clampOffset(nextOffset, zoom));
  };

  const handleCropPointerUp = (event?: React.PointerEvent<HTMLDivElement>) => {
    if (event) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    cropDragRef.current.dragging = false;
  };

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextZoom = Number(event.target.value);
    const clamped = clampOffset(cropOffset, nextZoom);
    setZoom(nextZoom);
    setCropOffset(clamped);
  };

  const handleCropCancel = () => {
    setIsCropOpen(false);
    setPendingThumbnail(null);
    setCropSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropConfirm = async () => {
    if (!cropperImageRef.current || !cropSrc) return;
    const canvas = document.createElement("canvas");
    canvas.width = cropFrame.width;
    canvas.height = cropFrame.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scaledWidth = imageSize.width * zoom;
    const scaledHeight = imageSize.height * zoom;
    ctx.drawImage(
      cropperImageRef.current,
      cropOffset.x,
      cropOffset.y,
      scaledWidth,
      scaledHeight,
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blobResult) => resolve(blobResult), "image/jpeg", 0.9);
    });

    if (!blob) {
      setError("Failed to crop image. Please try again.");
      return;
    }

    const croppedFile = new File([blob], "event-thumbnail.jpg", {
      type: "image/jpeg",
    });
    setThumbnailFile(croppedFile);
    setThumbnailPreview(URL.createObjectURL(blob));
    setIsCropOpen(false);
    setPendingThumbnail(null);
    setCropSrc(null);
  };

  const triggerToastAndRedirect = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      router.push("/back_office/dashboard/events");
    }, 1200);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {editingId ? "Edit Event" : "Add Event"}
          </h1>
          <p className="text-sm text-gray-500">
            Fill in the event information and save it to the list.
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/back_office/dashboard/events">Back to Events</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isLoadingEvent && (
              <div className="text-sm text-gray-500">Loading event...</div>
            )}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Event Name
                </label>
                <Input
                  value={formState.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Summer Music Fest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Venue
                </label>
                <Select
                  value={formState.venueId}
                  onValueChange={(value) => updateField("venueId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading && (
                      <SelectItem value="loading" disabled>
                        Loading venues...
                      </SelectItem>
                    )}
                    {!loading && (data ?? []).length === 0 && (
                      <SelectItem value="empty" disabled>
                        No venues available
                      </SelectItem>
                    )}
                    {(data ?? []).map((venue) => (
                      <SelectItem key={venue.id} value={String(venue.id)}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {venuesError && (
                  <p className="text-xs text-red-500">{venuesError}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <Input
                  type="date"
                  value={formState.date}
                  onChange={(event) => updateField("date", event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={formState.startTime}
                    onChange={(event) =>
                      updateField("startTime", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={formState.endTime}
                    onChange={(event) =>
                      updateField("endTime", event.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <Select
                  value={formState.category}
                  onValueChange={(value) => updateField("category", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  value={formState.status}
                  onValueChange={(value) => updateField("status", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formState.capacity}
                  onChange={(event) =>
                    updateField("capacity", event.target.value)
                  }
                  placeholder="350"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Ticket Price
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  placeholder="25.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                value={formState.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Add a short description or special notes."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Thumbnail
              </label>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleThumbnailChange}
                ref={fileInputRef}
              />
              <p className="text-xs text-gray-500">
                Upload an image, then crop and zoom before saving.
              </p>
              {thumbnailPreview && (
                <div className="mt-2">
                  <img
                    src={thumbnailPreview}
                    alt="Event thumbnail preview"
                    className="h-32 w-48 rounded-md object-cover border border-gray-200"
                  />
                </div>
              )}
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isSubmitting || isLoadingEvent}>
                {editingId ? "Update Event" : "Save Event"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                disabled={isSubmitting || isLoadingEvent}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {isCropOpen && cropSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Crop Thumbnail
              </h2>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={handleCropCancel}
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div
                className="relative mx-auto overflow-hidden rounded-md border border-gray-200 bg-gray-100"
                style={{
                  width: cropFrame.width,
                  height: cropFrame.height,
                }}
                onPointerDown={handleCropPointerDown}
                onPointerMove={handleCropPointerMove}
                onPointerUp={handleCropPointerUp}
                onPointerLeave={handleCropPointerUp}
              >
                <img
                  ref={cropperImageRef}
                  src={cropSrc}
                  alt="Crop preview"
                  onLoad={handleCropImageLoad}
                  className="absolute left-0 top-0 select-none"
                  style={{
                    transform: `translate(${cropOffset.x}px, ${cropOffset.y}px) scale(${zoom})`,
                    transformOrigin: "top left",
                    cursor: "grab",
                  }}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Zoom
                </label>
                <input
                  type="range"
                  min={minZoom}
                  max={Math.max(4, minZoom * 3)}
                  step={0.01}
                  value={zoom}
                  onChange={handleZoomChange}
                  className="w-full"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={handleCropConfirm}>
                  Use Crop
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCropCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {toastMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-md bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
