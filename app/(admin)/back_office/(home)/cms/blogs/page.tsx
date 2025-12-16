"use client";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef } from "react";
import { Edit, Trash2 } from "lucide-react";
import { blog as Blog } from "@/app/generated/prisma";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import { ICellRendererParams } from "ag-grid-community";

export default function BlogManagementPage() {
  const { data, loading, error, call } = useApi<Blog[]>();
  useEffect(() => {
    const token = localStorage.getItem("authToken") || "";
    call("/api/admin/blogs", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }, []);
  const gridRef = useRef<AgGridReact>(null);
  const rowData = data;

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Title",
        field: "title",
        flex: 2,
        cellClass: "font-semibold text-black",
      },
      {
        headerName: "Slug",
        field: "slug",
        flex: 2,
        cellClass: "text-xs text-gray-500",
      },
      {
        headerName: "Author",
        field: "author",
        flex: 1,
        cellClass: "text-gray-800",
      },
      {
        headerName: "Published Date",
        field: "publishedDate",
        flex: 1,
        cellClass: "text-xs text-gray-400",
      },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        cellClass: "text-xs text-gray-400",
      },
      {
        headerName: "Actions",
        field: "actions",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<Blog>) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/back_office/cms/blogs/add-blog/${params.data?.id}`}
              className="flex items-center"
            >
              <button className="p-1 rounded hover:bg-blue-100" title="Edit">
                <Edit className="text-blue-400" size={18} />
              </button>
            </Link>
            <div className="flex items-center">
              <button className="p-1 rounded hover:bg-red-100" title="Delete">
                <Trash2 className="text-red-400" size={18} />
              </button>
            </div>
          </div>
        ),
        sortable: false,
        filter: false,
      },
    ],
    []
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Blog Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, search, and filter all your blogs in one place.
          </p>
        </div>
        <Link
          href="/back_office/cms/blogs/add-blog"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          + New Blog
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
          loading={loading}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          autoSizePadding={8}
          rowHeight={40}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}
