"use client";
import { show as Show } from "@/app/generated/prisma";
import AddShow from "@/components/admin/AddShow";
import { useApi } from "@/hooks/useApi";
import { ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useRef, useMemo, useState } from "react";

export default function ShowsPage() {
  const { data, loading, call } = useApi<Show[]>();
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);
  const fetchShows = async () => {
    const token = localStorage.getItem("authToken") || "";
    await call("/api/admin/shows", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };
  useEffect(() => {
    fetchShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dateFormatter = (params: ValueFormatterParams) => {
    return new Date(params.value).toLocaleString();
  };
  const gridRef = useRef<AgGridReact>(null);
  const rowData = data;
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Movie",
        field: "movieTitle",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Auditorium",
        field: "auditoriumName",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Start Time",
        field: "startAt",
        flex: 2,
        valueFormatter: dateFormatter,
        cellClass: "font-semibold text-black",
      },

      {
        headerName: "Actions",
        field: "actions",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<Show>) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedShowId(params.data?.id ?? null);
                setIsShowModalOpen(true);
              }}
              className="p-1 rounded hover:bg-blue-100"
              title="Edit"
            >
              <Edit className="text-blue-400" size={18} />
            </button>
            <button
              onClick={() => {}}
              className="p-1 rounded hover:bg-red-100"
              title="Delete"
            >
              <Trash2 className="text-red-400" size={18} />
            </button>
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
            Shows Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, search, and filter all your Shows in one place.
          </p>
        </div>
        <button
          onClick={() => {
            setIsShowModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          + New Show
        </button>
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
      {isShowModalOpen && (
        <AddShow
          onClose={() => setIsShowModalOpen(false)}
          showId={selectedShowId ?? undefined}
          onAdd={() => null}
        />
      )}
    </div>
  );
}
