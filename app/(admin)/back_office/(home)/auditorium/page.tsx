"use client";
import { auditorium as Auditorium } from "@/app/generated/prisma";
import { useApi } from "@/hooks/useApi";
import { useEffect, useRef, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ICellRendererParams } from "ag-grid-community";
import { Edit, SofaIcon, Trash2 } from "lucide-react";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import AddAudiModal from "@/components/admin/AddAuditoriumModal";
import SeatingModal from "@/components/admin/SeatingModal";

export default function AuditoriumPage() {
  const { data, loading, call } = useApi<Auditorium[]>();
  const [isAddAudiOpen, setIsAddAudiOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedAudiId, setSelectedAudiId] = useState<number | null>(null);
  const [selectedAudiName, setSelectedAudiName] = useState<string>("");
  const [isSeatingOpen, setIsSeatingOpen] = useState<boolean>(false);

  const fetchAuditoriums = async () => {
    const token = localStorage.getItem("authToken") || "";
    await call("/api/admin/auditoriums", {
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
    if (!selectedAudiId) return;

    const token = localStorage.getItem("authToken") || "";
    const response = await fetch(`/api/admin/auditoriums/${selectedAudiId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete venue");
    }

    setIsDeleteOpen(false);
    setSelectedAudiId(null);
    setSelectedAudiName("");
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
        cellRenderer: (params: ICellRendererParams<Auditorium>) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedAudiId(params.data?.id ?? null);
                setIsSeatingOpen(true);
              }}
              className="p-1 rounded hover:bg-blue-100"
              title="Edit"
            >
              <SofaIcon className="text-blue-400" size={18} />
            </button>
            <button
              onClick={() => {
                setSelectedAudiId(params.data?.id ?? null);
              }}
              className="p-1 rounded hover:bg-blue-100"
              title="Edit"
            >
              <Edit className="text-blue-400" size={18} />
            </button>
            <button
              onClick={() => {
                setSelectedAudiId(params.data?.id ?? null);
                setSelectedAudiName(params.data?.name ?? "");
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
    []
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Auditorium Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, search, and filter all your Auditoriums in one place.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedAudiId(null);
            setIsAddAudiOpen(true);
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
      {isSeatingOpen && (
        <SeatingModal
          onClose={() => {
            setIsSeatingOpen(false);
            setSelectedAudiId(null);
          }}
          audiId={selectedAudiId ?? undefined}
        />
      )}

      {/* Add/Edit Venue Modal */}
      {isAddAudiOpen && (
        <AddAudiModal
          onClose={() => {
            setIsAddAudiOpen(false);
            setSelectedAudiId(null);
          }}
          audiId={selectedAudiId ?? undefined}
          onAdd={fetchAuditoriums}
        />
      )}

      {/* Delete Venue Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedAudiId(null);
          setSelectedAudiName("");
        }}
        onConfirm={handleDeleteAudi}
        title="Delete Auditorium"
        itemName={selectedAudiName}
        itemType="Auditorium"
        description="This will permanently delete the auditorium and all associated data."
      />
    </div>
  );
}
