"use client";
import { cinema as EventVenue } from "@/app/generated/prisma";
import { useEffect, useRef, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ICellRendererParams } from "ag-grid-community";
import { Edit, Trash2 } from "lucide-react";
import AddEventVenueModal from "@/components/admin/AddEventVenueModal";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";

export default function EventHallPage() {
  const [venue, setVenue] = useState<EventVenue[]>();
  const [isAddVenueOpen, setIsAddVenueOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [selectedVenueName, setSelectedVenueName] = useState<string>("");

  const fetchVenues = async () => {
    const res =
      await apiClient.get<ApiResponse<EventVenue[]>>("/admin/cinemas");
    if (res) {
      setVenue(res.data.data);
    }
  };

  useEffect(() => {
    fetchVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteVenue = async () => {
    if (!selectedVenueId) return;
    const res = await apiClient.delete(`/admin/cinemas/${selectedVenueId}`);
    if (res) {
      setIsDeleteOpen(false);
      setSelectedVenueId(null);
      setSelectedVenueName("");
      await fetchVenues();
    }
  };

  const gridRef = useRef<AgGridReact>(null);
  const rowData = venue;
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name",
        flex: 2,
        cellClass: "font-semibold text-black",
      },
      {
        headerName: "Location",
        field: "location",
        flex: 2,
        cellClass: "font-semibold text-black",
      },
      {
        headerName: "Actions",
        field: "actions",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<EventVenue>) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedVenueId(params.data?.id ?? null);
                setIsAddVenueOpen(true);
              }}
              className="p-1 rounded hover:bg-blue-100"
              title="Edit"
            >
              <Edit className="text-blue-400" size={18} />
            </button>
            <button
              onClick={() => {
                setSelectedVenueId(params.data?.id ?? null);
                setSelectedVenueName(params.data?.name ?? "");
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
            Event Venue Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, search, and filter all your Event Venues in one place.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedVenueId(null);
            setIsAddVenueOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          + New Venue
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
          columnDefs={columnDefs}
          domLayout="autoHeight"
          autoSizePadding={8}
          rowHeight={40}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      {/* Add/Edit Venue Modal */}
      {isAddVenueOpen && (
        <AddEventVenueModal
          onClose={() => {
            setIsAddVenueOpen(false);
            setSelectedVenueId(null);
          }}
          venueId={selectedVenueId ?? undefined}
          onAdd={fetchVenues}
        />
      )}

      {/* Delete Venue Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedVenueId(null);
          setSelectedVenueName("");
        }}
        onConfirm={handleDeleteVenue}
        title="Delete Venue"
        itemName={selectedVenueName}
        itemType="Venue"
        description="This will permanently delete the venue and all associated data."
      />
    </div>
  );
}
