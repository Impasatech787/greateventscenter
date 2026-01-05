"use client";

import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ICellRendererParams } from "ag-grid-community";
import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import { service as Service } from "@/app/generated/prisma";

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const gridRef = useRef<AgGridReact>(null);

  const fetchServices = async () => {
    try {
      const res = await apiClient.get<ApiResponse<Service[]>>(
        "/admin/services",
      );
      setServices(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const confirmed = window.confirm("Delete this service?");
    if (!confirmed) return;

    try {
      await apiClient.delete(`/admin/services/${id}`);
      setServices((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Heading",
        field: "heading",
        flex: 1.5,
        cellClass: "font-semibold text-black",
      },
      {
        headerName: "Subheading",
        field: "subheading",
        flex: 2,
        cellClass: "text-xs text-gray-500",
      },
      {
        headerName: "Link",
        field: "href",
        flex: 1.5,
        cellRenderer: (params: ICellRendererParams<Service>) => (
          <a
            href={params.data?.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          >
            Visit <ExternalLink size={14} />
          </a>
        ),
      },
      {
        headerName: "Media",
        field: "mediaUrl",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<Service>) => (
          <div className="flex items-center">
            {params.data?.mediaUrl ? (
              <img
                src={params.data.mediaUrl}
                alt={params.data.heading}
                className="h-10 w-10 rounded object-cover border border-gray-200"
              />
            ) : (
              <span className="text-xs text-gray-400">No image</span>
            )}
          </div>
        ),
      },
      {
        headerName: "Actions",
        field: "actions",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<Service>) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/back_office/cms/services/add-service/${params.data?.id}`}
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
                onClick={() => handleDelete(params.data?.id)}
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
            Services Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage the services displayed in the content section.
          </p>
        </div>
        <Link
          href="/back_office/cms/services/add-service"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          + Add Service
        </Link>
      </div>
      <div
        className="rounded-xl border border-gray-200 shadow-sm bg-white"
        style={{ width: "100%" }}
      >
        <AgGridReact
          rowStyle={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            color: "#374151",
          }}
          ref={gridRef}
          rowData={services}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          autoSizePadding={8}
          rowHeight={56}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}
