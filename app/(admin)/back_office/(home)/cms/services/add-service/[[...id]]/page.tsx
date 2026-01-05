"use client";

import { useEffect, useRef, useState } from "react";
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
    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image (PNG, JPEG, WebP, or GIF)");
      return;
    }

    setFormData((prev) => ({ ...prev, mediaFile: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError("");
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

      setSuccess(serviceId ? "Service updated" : "Service created");
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
                    <p className="text-sm">Upload one image</p>
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
    </div>
  );
}
