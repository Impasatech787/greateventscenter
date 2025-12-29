"use client";

import { useApi } from "@/hooks/useApi";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Edit, Trash2 } from "lucide-react";
import { booking } from "@/app/generated/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type BookingRow = booking & {
  user?: {
    firstName?: string;
    lastName?: string;
  };
  movieTitle?: string;
  cinemaName?: string;
  auditoriumName?: string;
  startAt?: string | Date;
};

export default function BookingsListPage() {
  const { data, call, loading } = useApi<BookingRow[]>();

  const fetchBookings = async () => {
    const token = localStorage.getItem("authToken") || "";
    await call("/api/admin/bookings", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const dateFormatter = useCallback((params: ValueFormatterParams) => {
    return new Date(params.value).toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const gridRef = useRef<AgGridReact>(null);
  const rowData: BookingRow[] = data ?? [];

  const columnDefs = useMemo<ColDef<BookingRow>[]>(
    () => [
      {
        headerName: "Booking ID",
        field: "id",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "User",
        valueGetter: (params: ValueGetterParams<BookingRow>) => {
          const first = params.data?.user?.firstName ?? "";
          const last = params.data?.user?.lastName ?? "";
          return `${first} ${last}`.trim();
        },
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Movie",
        field: "movieTitle",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Cinema",
        field: "cinemaName",
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
        headerName: "Status",
        field: "status",
        flex: 2,
        cellClass: "font-semibold text-black",
        // filter: "agSetColumnFilter",
        floatingFilter: true,
        // filterParams: { values: ["Male", "Female", "Other"] },
      },
      {
        headerName: "Show Time",
        field: "startAt",
        flex: 2,
        valueFormatter: dateFormatter,
        cellClass: "font-semibold text-black",
        filter: "agDateColumnFilter",
        filterParams: {
          defaultOption: "inRange",
          buttons: ["apply", "reset", "cancel"], // Add the 'reset' button
          closeOnApply: true,
        },

        // floatingFilter: true,
      },
      {
        headerName: "Actions",
        flex: 1,
        cellRenderer: (_params: ICellRendererParams<BookingRow>) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
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
    [dateFormatter],
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Bookigs Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, search, and filter all your Bookings in one place.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 py-2">
        <h2 className="text-lg font-semibold">Search Booking</h2>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className="spcae-y-2">
            <label>Movie</label>
            <Input className="" placeholder="Movie Name" />
          </div>
          <div className="spcae-y-2">
            <label>Audi</label>
            <Input className="" placeholder="Audi" />
          </div>
          <div className="spcae-y-2">
            <label>Date</label>
            <Input
              className=""
              type="datetime-local"
              placeholder="Start Time"
            />
          </div>
          <Button className="bg-blue-400 mt-4">Filter</Button>
        </div>
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
