"use client";
import { seat as SeatingChart } from "@/app/generated/prisma";
import { useApi } from "@/hooks/useApi";
import { useEffect, useRef, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ICellRendererParams } from "ag-grid-community";
import { Edit, Trash2 } from "lucide-react";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import AddAudiModal from "@/components/admin/AddAuditoriumModal";

export default function SeatingPage() {
  const { data, loading, call } = useApi<SeatingChart[]>();
  const [isAddSeatingChartOpen, setIsAddSeatingChartOpen] =
    useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedSeatingChartId, setSelectedSeatingChartId] = useState<
    number | null
  >(null);
  const [selectedSeatingChartName, setSelectedSeatingChartName] =
    useState<string>("");

  const fetchAuditoriums = async () => {
    const token = localStorage.getItem("authToken") || "";
    await call("/api/admin/seats", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    fetchAuditoriums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteAudi = async () => {
    if (!selectedSeatingChartId) return;

    const token = localStorage.getItem("authToken") || "";
    const response = await fetch(
      `/api/admin/auditoriums/${selectedSeatingChartId}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete venue");
    }

    setIsDeleteOpen(false);
    setSelectedSeatingChartId(null);
    setSelectedSeatingChartName("");
    await fetchAuditoriums();
  };

  const gridRef = useRef<AgGridReact>(null);
  const rowData = data;
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: true,
      },
      {
        headerName: "Venue",
        field: "cinemaName",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: true,
      },
      {
        headerName: "Actions",
        field: "actions",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<SeatingChart>) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedSeatingChartId(params.data?.id ?? null);
                setIsAddSeatingChartOpen(true);
              }}
              className="p-1 rounded hover:bg-blue-100"
              title="Edit"
            >
              <Edit className="text-blue-400" size={18} />
            </button>
            <button
              onClick={() => {
                setSelectedSeatingChartId(params.data?.id ?? null);
                // setSelectedAudiName(params.data?.name ?? "");
                setIsDeleteOpen(true);
              }}
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
    [],
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Seating Chart Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, search, and filter all your Auditoriums in one place.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedSeatingChartId(null);
            setIsAddSeatingChartOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          + New Auditorium
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

      {/* Add/Edit Venue Modal */}
      {isAddSeatingChartOpen && (
        <AddAudiModal
          onClose={() => {
            setIsAddSeatingChartOpen(false);
            setSelectedSeatingChartId(null);
          }}
          audiId={selectedSeatingChartId ?? undefined}
          onAdd={fetchAuditoriums}
        />
      )}

      {/* Delete Venue Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedSeatingChartId(null);
          setSelectedSeatingChartName("");
        }}
        onConfirm={handleDeleteAudi}
        title="Delete Auditorium"
        itemName={selectedSeatingChartName}
        itemType="Auditorium"
        description="This will permanently delete the auditorium and all associated data."
      />
    </div>
  );
}
