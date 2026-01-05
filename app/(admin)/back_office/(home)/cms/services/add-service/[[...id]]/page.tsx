"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";

interface ServiceFormData {
  heading: string;
  subheading: string;
  href: string;
  mediaUrl?: string | null;
}

export default function AddServicePage() {
  const params = useParams<{ id: string[] }>();
  const serviceId = params.id?.[0];
  const router = useRouter();
  const { data, call } = useApi<ServiceFormData>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    href: "",
    mediaFile: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingMedia, setPendingMedia] = useState<File | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const cropperImageRef = useRef<HTMLImageElement | null>(null);
  const cropDragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    dragging: boolean;
  }>({ startX: 0, startY: 0, originX: 0, originY: 0, dragging: false });
  const allowedMediaTypes = useMemo(
    () => ["image/png", "image/jpeg", "image/webp", "image/gif"],
    [],
  );
  const cropFrame = useMemo(() => ({ width: 480, height: 270 }), []);

  useEffect(() => {
    if (!serviceId) return;
    const token = localStorage.getItem("authToken") || "";
    call(`/api/admin/services/${serviceId}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }, [serviceId, call]);

  useEffect(() => {
    if (!data) return;
    setFormData((prev) => ({
      ...prev,
      heading: data.heading || "",
      subheading: data.subheading || "",
      href: data.href || "",
    }));
    setPreview(data.mediaUrl || null);
  }, [data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!allowedMediaTypes.includes(file.type)) {
      setError("Please upload a valid image (PNG, JPEG, WebP, or GIF)");
      return;
    }

    setError("");
    setPendingMedia(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setCropSrc(result);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  const clampOffset = (offset: { x: number; y: number }, scale: number) => {
    const scaledWidth = imageSize.width * scale;
    const scaledHeight = imageSize.height * scale;
    const minX = Math.min(0, cropFrame.width - scaledWidth);
    const minY = Math.min(0, cropFrame.height - scaledHeight);
    return {
      x: Math.max(minX, Math.min(0, offset.x)),
      y: Math.max(minY, Math.min(0, offset.y)),
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
    setPendingMedia(null);
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

    const croppedFile = new File([blob], "service-media.jpg", {
      type: "image/jpeg",
    });
    setFormData((prev) => ({ ...prev, mediaFile: croppedFile }));
    setPreview(URL.createObjectURL(blob));
    setIsCropOpen(false);
    setPendingMedia(null);
    setCropSrc(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.heading.trim()) {
      setError("Heading is required");
      return;
    }

    if (!formData.subheading.trim()) {
      setError("Subheading is required");
      return;
    }

    if (!formData.href.trim()) {
      setError("Link is required");
      return;
    }

    if (!serviceId && !formData.mediaFile) {
      setError("Service image is required");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("heading", formData.heading);
      payload.append("subheading", formData.subheading);
      payload.append("href", formData.href);
      if (formData.mediaFile) {
        payload.append("file", formData.mediaFile);
      }

      const token = localStorage.getItem("authToken") || "";
      const response = await fetch(
        serviceId ? `/api/admin/services/${serviceId}` : "/api/admin/services",
        {
          method: serviceId ? "PATCH" : "POST",
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: payload,
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save service");
      }

      const toastText = serviceId
        ? "Service Updated Successfully"
        : "Service added successfully";
      setSuccess(serviceId ? "Service updated" : "Service created");
      setToastMessage(toastText);
      setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      setTimeout(() => {
        router.push("/back_office/cms/services");
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/back_office/cms/services"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {serviceId ? "Edit Service" : "Add New Service"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Add a heading, link, and one image for this service.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Heading
                </label>
                <Input
                  value={formData.heading}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      heading: e.target.value,
                    }))
                  }
                  placeholder="Service heading"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Subheading
                </label>
                <Input
                  value={formData.subheading}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subheading: e.target.value,
                    }))
                  }
                  placeholder="Short description"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Link (href)
                </label>
                <Input
                  value={formData.href}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      href: e.target.value,
                    }))
                  }
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Media</label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center bg-white">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {preview ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Upload size={24} />
                    <p className="text-sm">Upload an image, then crop and zoom</p>
                  </div>
                )}
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {preview ? "Change image" : "Upload image"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/back_office/cms/services"
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader className="animate-spin" size={16} />
                  Saving...
                </span>
              ) : serviceId ? (
                "Update Service"
              ) : (
                "Create Service"
              )}
            </Button>
          </div>
        </form>
      </div>
      {isCropOpen && cropSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Crop Service Image
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
