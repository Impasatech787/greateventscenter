"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Loader } from "lucide-react";
import Image from "next/image";

import dynamic from "next/dynamic";
import { useApi } from "@/hooks/useApi";
import { BlogStatus } from "@/app/generated/prisma";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const QuillEditor = dynamic(() => import("@/components/elements/QuilEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[420px] border border-gray-300 rounded-lg animate-pulse bg-gray-50" />
  ),
});

interface FormData {
  title: string;
  author: string;
  content: string;
  featuredMedia: File | null;
  status?: BlogStatus;
}

export default function AddBlogPage() {
  const params = useParams<{ id: string[] }>();
  const blogId = params.id?.[0];
  const { data, call } = useApi<FormData>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    content: "",
    featuredMedia: null,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
    });
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, author: e.target.value });
  };

  const handleContentChange = (content: string) => {
    setFormData({ ...formData, content });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

      setFormData({ ...formData, featuredMedia: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.author.trim()) {
      setError("Author is required");
      return;
    }
    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      setError("Content is required");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("content", formData.content);

      if (formData.featuredMedia) {
        formDataToSend.append("file", formData.featuredMedia);
      }

      const token = localStorage.getItem("authToken") || "";
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create blog");
      }

      setSuccess("Blog created successfully!");
      setTimeout(() => {
        router.push("/back_office/cms/blogs");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      const token = localStorage.getItem("authToken") || "";
      call(`/api/admin/blogs/${blogId}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    };
    fetchBlog();
  }, [blogId]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      title: data?.title || "",
      author: data?.author || "",
      content: data?.content || "",
      featuredMedia: data?.featuredMedia || null,
      status: data?.status,
    }));
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/back_office/cms/blogs"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Add New Blog
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Create and manage your blog content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alerts */}
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

            {/* Title */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Blog Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter blog title"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Slug will auto-generate based on title
              </p>
            </div>

            {/* Author */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label
                htmlFor="author"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Author <span className="text-red-500">*</span>
              </label>
              <Input
                id="author"
                type="text"
                placeholder="Enter author name"
                value={formData.author}
                onChange={handleAuthorChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <QuillEditor
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  style={{ height: 300 }}
                  placeholder="Start writing your article here..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ script: "sub" }, { script: "super" }],
                      [{ indent: "-1" }, { indent: "+1" }],
                      [{ direction: "rtl" }],
                      [{ size: ["small", false, "large", "huge"] }],
                      [{ color: [] }, { background: [] }],
                      [{ font: [] }],
                      [{ align: [] }],
                      ["clean"],
                      ["link", "image", "video"],
                    ],
                  }}
                  formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                    "video",
                    "align",
                    "color",
                    "background",
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Featured Image
              </label>

              {preview ||
              (typeof formData.featuredMedia === "string" &&
                formData.featuredMedia) ? (
                <div className="relative w-full mb-4 w-50 h-40">
                  <Image
                    src={
                      preview
                        ? preview
                        : typeof formData.featuredMedia === "string"
                        ? formData.featuredMedia
                        : ""
                    }
                    alt="Preview"
                    fill
                    className="w-full h-40 object-cover rounded-lg border border-gray-300"
                    style={{ objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFormData({ ...formData, featuredMedia: null });
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-sm text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPEG, WebP, GIF
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-3">
                Max file size: 5MB. Recommended: 1200x630px
              </p>
            </div>
            {blogId && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      status: value as BlogStatus,
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Blog Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value={BlogStatus.ARCHIVED}>
                        Arcive
                      </SelectItem>
                      <SelectItem value={BlogStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={BlogStatus.PUBLISHED}>
                        Published
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Submit Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    {blogId ? "Updating..." : "Uploading..."}
                  </>
                ) : blogId ? (
                  "Update Blog"
                ) : (
                  "Upload Blog"
                )}
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/back_office/cms/blogs")}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
