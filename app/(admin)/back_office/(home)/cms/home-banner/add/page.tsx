"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/axios";
import { ApiError } from "@/types/ApiError";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";

type FormState = {
  title: string;
  heroText: string;
  activeStatus: string;
  file: File | undefined;
};

type FormStateErros = {
  title?: string;
  heroText?: string;
  activeStatus?: string;
  file?: string;
};

export default function AddHomeBannerPage() {
  const [formState, setFormState] = useState<FormState>({
    title: "",
    heroText: "",
    activeStatus: "",
    file: undefined,
  });
  const router = useRouter();
  const [formStateError, setFormStateError] = useState<FormStateErros>({});
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isLoadingfetch, setIsLoadingfetch] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const homeBannerId = searchParams.get("id");
    if (!homeBannerId) {
      setEditingId(null);
      return;
    }
    const parsedId = Number(homeBannerId);
    if (Number.isNaN(parsedId)) {
      setError("Invalid Home Banner id.");
      setEditingId(null);
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }
    setEditingId(parsedId);

    const fetchHomeBanner = async () => {
      try {
        setIsLoadingfetch(true);
        const res = await apiClient.get(`/admin/home-banner/${parsedId}`);
        const data = res.data.data;
        if (res) {
          setFormState({
            title: data.title,
            heroText: data.bannerHero,
            activeStatus: String(data.isActive),
            file: undefined,
          });
          setPreviewUrl(data.bannerUrl);
        }
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
          setTimeout(() => {
            setError(null);
          }, 2000);
        }
      } finally {
        setIsLoadingfetch(false);
      }
    };
    fetchHomeBanner();
  }, []);
  const allowedThumbnailTypes = useMemo(
    () => ["image/png", "image/jpeg", "image/webp", "image/gif"],
    [],
  );
  const onInputChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const validateInput = () => {
    const newErrors: FormStateErros = {};

    if (!formState.title.trim()) {
      newErrors.title = "Banner Title is Required";
    }
    if (!formState.heroText.trim()) {
      newErrors.heroText = "Banner Hero Text is Required";
    }
    if (!formState.activeStatus.trim()) {
      newErrors.activeStatus = "Banner Active Status is Required";
    }
    if (!editingId && !formState.file) {
      newErrors.file = "Banner Image  is Required";
    }
    setFormStateError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!allowedThumbnailTypes.includes(file.type)) {
      setError("Please upload a valid image (PNG, JPEG, WebP, or GIF).");
      return;
    }
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      setFormState((prev) => ({ ...prev, ["file"]: file }));
    };
    reader.readAsDataURL(file);
  };

  const onFormSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateInput()) {
      try {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title", formState.title);
        formData.append("isActive", formState.activeStatus);
        formData.append("heroText", formState.heroText);
        if (formState.file) {
          formData.append("banner", formState.file);
        }
        if (editingId) {
          await apiClient.patch(`/admin/home-banner/${editingId}`, formData);
          setToastMessage("Home Banner Edited Sucessfully");
        } else {
          await apiClient.post("/admin/home-banner", formData);
          setToastMessage("Home Banner Added Sucessfully");
        }
        setTimeout(() => {
          router.push("/back_office/cms/home-banner");
        }, 2000);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
          setTimeout(() => {
            setError(null);
          }, 2000);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  if (isLoadingfetch) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Loading Home Banner…
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {editingId ? "Edit Home Banner" : "Add Home Banner"}
          </h1>
          <p className="text-sm text-gray-500">
            Fill in the Home Banner information and save it to the list.
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/back_office/cms/home-banner">Back to Home Banners</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Home Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onFormSubmission} className="space-y-4">
            <fieldset disabled={isSubmitting} className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <Input
                    placeholder="Event Banner"
                    type="text"
                    value={formState.title}
                    onChange={(e) => onInputChange("title", e.target.value)}
                  />
                  {formStateError?.title && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {formStateError.title}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Hero Title
                  </label>
                  <Input
                    type="text"
                    placeholder="event"
                    value={formState.heroText}
                    onChange={(e) => onInputChange("heroText", e.target.value)}
                  />
                  {formStateError?.heroText && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {formStateError.heroText}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select
                    value={formState.activeStatus}
                    onValueChange={(value) =>
                      onInputChange("activeStatus", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {formStateError?.activeStatus && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {formStateError.activeStatus}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Banner Image
                </label>
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={onImageChange}
                />
                {formStateError?.file && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formStateError.file}
                  </div>
                )}
                {previewUrl && (
                  <div className="mt-2">
                    <img
                      src={previewUrl}
                      alt="Event thumbnail preview"
                      className="h-32 w-48 rounded-md object-cover border border-gray-200"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {editingId ? "Edit Home Banner" : "Save Home Banner"}
                </Button>
              </div>
            </fieldset>
          </form>
        </CardContent>
      </Card>
      {toastMessage && (
        <div className="fixed bg-green-400 right-6 top-6 z-50 rounded-md bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          {toastMessage}
        </div>
      )}
      {error && (
        <div className="fixed flex gap-4 items-center bg-red-400 right-6 top-6 z-50 rounded-md bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          <TriangleAlert />
          {error}
        </div>
      )}
    </div>
  );
}
