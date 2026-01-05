"use client";

import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { ICellRendererParams } from "ag-grid-community";
import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import { homeBanner as HomeBanner } from "@/app/generated/prisma";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import { ApiError } from "@/types/ApiError";
export default function BlogManagementPage() {
  const [homeBanners, setHomeBanners] = useState<HomeBanner[]>([]);
  const [isDeleteOpen, setisDeleteOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedHomeBannerId, setSelectedHomeBannerId] = useState<
    number | null
  >(null);
  const [selectedHomeBannertitle, setSelectedHomeBannertitle] =
    useState<string>("");

  const handleDeleteHomeBanner = async () => {
    if (!selectedHomeBannerId) return;
    await apiClient.delete(`/admin/home-banner/${selectedHomeBannerId}`);
    setisDeleteOpen(false);
    setSelectedHomeBannerId(null);
    setSelectedHomeBannertitle("");
    setHomeBanners((prev) =>
      prev.filter((homeBanner) => homeBanner.id !== selectedHomeBannerId),
    );
  };
  useEffect(() => {
    const fetchHomeBanners = async () => {
      try {
        const res =
          await apiClient.get<ApiResponse<HomeBanner[]>>(`/admin/home-banner`);
        setHomeBanners(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHomeBanners();
  }, []);
  const gridRef = useRef<AgGridReact>(null);
  const rowData = homeBanners;

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Title",
        field: "title",
        flex: 2,
        cellClass: "font-semibold",
      },
      {
        headerName: "Hero Text",
        field: "bannerHero",
        flex: 2,
        cellClass: "font-semibold  text-gray-500",
      },
      {
        headerName: "Status",
        field: "isActive",
        flex: 1,
        cellClass: "text-xs text-blue-400",
      },
      {
        headerName: "Actions",
        field: "actions",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<HomeBanner>) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/back_office/cms/home-banner/add/?id=${params.data?.id}`}
              className="flex items-center"
            >
              <button className="p-1 rounded hover:bg-blue-100" title="Edit">
                <Edit className="text-blue-400" size={18} />
              </button>
            </Link>
            <div className="flex items-center">
              <button
                className="p-1 rounded hover:bg-red-100"
                title="Delete"
                onClick={() => {
                  setSelectedHomeBannerId(params.data?.id ?? null);
                  setSelectedHomeBannertitle(params.data?.title ?? "");
                  setisDeleteOpen(true);
                }}
              >
                <Trash2 className="text-red-400" size={18} />
              </button>
            </div>
          </div>
        ),
        sortable: false,
        filter: false,
      },
    ],
    [],
  );
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Home Banners Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, search, and filter all your Home Banners in one place.
          </p>
        </div>
        <Link
          href="/back_office/cms/home-banner/add"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          + New Home Banner
        </Link>
      </div>
      <div
        className=" rounded-xl border border-gray-200 shadow-sm bg-white"
        style={{ width: "100%" }}
      >
        <AgGridReact
          rowStyle={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            color: "#374151",
          }}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          autoSizePadding={8}
          rowHeight={40}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      {/* Delete Venue Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setisDeleteOpen(false);
          setSelectedHomeBannerId(null);
          setSelectedHomeBannertitle("");
        }}
        onConfirm={handleDeleteHomeBanner}
        title="Delete Home Banner"
        itemName={selectedHomeBannertitle}
        itemType="Home Banner"
        description="This will permanently delete the Home Banner and all associated data."
      />
    </div>
  );
}
