"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Edit, Eye } from "lucide-react";
import { booking } from "@/app/generated/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import { Movie } from "@/app/(user)/movies/page";

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

interface FilterState {
  bookingId: number | null;
  movieName: string;
  movieId: number | null;
  cinemaName: string;
  cinemaId: number | null;
  showDate: string;
  showId: number | null;
  showName: string;
}

export default function BookingsListPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [movies, setMovies] = useState<{ title: string; id: number }[]>([]);
  const [cinemas, setCinemas] = useState<{ name: string; id: number }[]>([]);
  const [shows, setShows] = useState<
    { id: number; audiName: string; startTime: string }[]
  >([]);
  const [filterState, setFilterState] = useState<FilterState>({
    bookingId: null,
    movieId: null,
    movieName: "",
    cinemaName: "",
    cinemaId: null,
    showDate: "",
    showId: null,
    showName: "",
  });

  useEffect(() => {
    filterBooking();
  }, []);

  const filterMovies = async (movieSearchText: string) => {
    try {
      const res = await apiClient.get<ApiResponse<Movie[]>>(
        `/admin/movies?name=${movieSearchText}`,
      );
      if (res) {
        setMovies(res.data.data);
        filterShows();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const filterCinema = async (cinemaSearchText: string) => {
    try {
      const res = await apiClient.get<
        ApiResponse<{ name: string; id: number }[]>
      >(`/admin/cinemas?name=${cinemaSearchText}`);
      if (res) {
        setCinemas(res.data.data);
        filterShows();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filterShows = async (filterDate?: string) => {
    try {
      const res = await apiClient.post<
        ApiResponse<{ id: number; audiName: string; startTime: string }[]>
      >(`/admin/shows/filter`, {
        movieId: filterState.movieId,
        cinemaId: filterState.cinemaId,
        showDate: filterDate ? filterDate : filterState.showDate,
      });
      if (res) {
        setShows(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filterBooking = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.post<ApiResponse<BookingRow[]>>(
        `/admin/bookings/filter`,
        {
          bookingId: filterState.bookingId,
          movieId: filterState.movieId,
          cinemaId: filterState.cinemaId,
          showId: filterState.showId,
          showDate: filterState.showDate,
        },
      );
      if (res) {
        setBookings(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
  const rowData: BookingRow[] = bookings ?? [];

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
        cellRenderer: (params: ICellRendererParams<BookingRow>) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                router.push(`/back_office/bookings/${params.data?.id}`);
              }}
              className="p-1 rounded hover:bg-blue-100"
              title="Edit"
            >
              <Eye className="text-gray-800" size={18} />
            </button>
            <button
              onClick={() => {}}
              className="p-1 rounded hover:bg-blue-100"
              title="Edit"
            >
              <Edit className="text-blue-400" size={18} />
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
    <div className="mx-auto px-4 py-8">
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
          <div className="space-y-2">
            <label>Booking ID</label>
            <Input
              placeholder="Booking ID"
              type="number"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) => {
                setFilterState((prev) => ({
                  ...prev,
                  bookingId: Number(e.target.value),
                }));
              }}
            />
          </div>
          <div className="space-y-2 relative group">
            <label>Movie</label>
            <Input
              className=""
              type="text"
              value={filterState.movieName}
              onChange={(e) => {
                setFilterState((prev) => ({
                  ...prev,
                  movieName: e.target.value,
                  movieId: null,
                }));
                filterMovies(e.target.value);
              }}
              placeholder="Movie Name"
            />
            <div className="absolute mt-2 z-50 border border-gray-200 bg-gray-100 w-full hidden group-focus-within:block max-h-60 overflow-y-auto">
              {movies.length != 0 &&
                movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="border-b p-1 hover:bg-gray-200 cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShows([]);
                      setFilterState((prev) => ({
                        ...prev,
                        movieId: movie.id,
                        movieName: movie.title,
                      }));
                      requestAnimationFrame(() => {
                        (document.activeElement as HTMLElement)?.blur();
                      });
                    }}
                  >
                    {movie.title}
                  </div>
                ))}
            </div>
          </div>
          <div className="space-y-2 relative group">
            <label>Cinema</label>
            <Input
              className=""
              type="text"
              value={filterState.cinemaName}
              onChange={(e) => {
                setFilterState((prev) => ({
                  ...prev,
                  cinemaName: e.target.value,
                  cinemaId: null,
                }));
                filterCinema(e.target.value);
              }}
              placeholder="Cinema"
            />
            <div className="absolute mt-2 z-50 border border-gray-200 bg-gray-100 w-full hidden group-focus-within:block max-h-60 overflow-y-auto">
              {cinemas.length != 0 &&
                cinemas.map((cinema) => (
                  <div
                    key={cinema.id}
                    className="border-b p-1 hover:bg-gray-200 cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setFilterState((prev) => ({
                        ...prev,
                        cinemaId: cinema.id,
                        cinemaName: cinema.name,
                      }));

                      requestAnimationFrame(() => {
                        (document.activeElement as HTMLElement)?.blur();
                      });
                    }}
                  >
                    {cinema.name}
                  </div>
                ))}
            </div>
          </div>
          <div className="space-y-2 relative group">
            <label>Show Date</label>
            <Input
              className=""
              type="date"
              value={filterState.showDate}
              onChange={(e) => {
                setFilterState((prev) => ({
                  ...prev,
                  showDate: e.target.value,
                }));
                filterShows(e.target.value);
              }}
              placeholder="Select Show Date"
            />
          </div>
          {filterState.cinemaId &&
            filterState.movieId &&
            filterState.showDate && (
              <>
                <div className="space-y-2 relative group">
                  <label>Show</label>
                  <Input
                    className=""
                    type="text"
                    value={filterState.showName}
                    onChange={(e) => {
                      setFilterState((prev) => ({
                        ...prev,
                        showName: e.target.value,
                      }));
                      filterCinema(e.target.value);
                    }}
                    placeholder="Search Show"
                  />
                  <div className="absolute mt-2 z-50 border border-gray-200 bg-gray-100 w-full hidden group-focus-within:block max-h-60 overflow-y-auto">
                    {shows.length != 0 &&
                      shows.map((show) => (
                        <div
                          key={show.id}
                          className="border-b p-1 hover:bg-gray-200 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFilterState((prev) => ({
                              ...prev,
                              showId: show.id,
                              showName:
                                show.audiName +
                                "-" +
                                new Date(show.startTime).toLocaleTimeString(),
                            }));
                            requestAnimationFrame(() => {
                              (document.activeElement as HTMLElement)?.blur();
                            });
                          }}
                        >
                          {show.audiName +
                            "-" +
                            new Date(show.startTime).toLocaleTimeString()}
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          <Button className="bg-blue-400 mt-5" onClick={filterBooking}>
            Filter
          </Button>
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
          columnDefs={columnDefs}
          domLayout="autoHeight"
          autoSizePadding={8}
          rowHeight={40}
          pagination={true}
          paginationPageSize={10}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
