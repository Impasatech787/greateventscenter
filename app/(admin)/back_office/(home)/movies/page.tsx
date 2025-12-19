"use client";
import { movie as Movie } from "@/app/generated/prisma";
import { useApi } from "@/hooks/useApi";
import { useEffect, useRef, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ICellRendererParams } from "ag-grid-community";
import { Edit, Image as ImageIcon, Trash2 } from "lucide-react";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import AddMovieModal from "@/components/admin/AddMovie";

export default function MoviesPage() {
  const { data, loading, call } = useApi<Movie[]>();
  const [isAddMovieOpen, setIsAddMovieOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedMovieName, setSelectedMovieName] = useState<string>("");

  const fetchMovies = async () => {
    const token = localStorage.getItem("authToken") || "";
    await call("/api/admin/movies", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteMovie = async () => {
    if (!selectedMovieId) return;

    const token = localStorage.getItem("authToken") || "";
    const response = await fetch(`/api/admin/movies/${selectedMovieId}`, {
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
    setSelectedMovieId(null);
    setSelectedMovieName("");
    await fetchMovies();
  };

  const gridRef = useRef<AgGridReact>(null);
  const rowData = data;
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Title",
        field: "title",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Language",
        field: "language",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Duration (Min)",
        field: "durationMin",
        flex: 2,
        cellClass: "font-semibold text-black",
      },
      {
        headerName: "Release Date",
        field: "releaseDate",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agDateColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Genre",
        field: "genres",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: true,
      },
      {
        headerName: "Actions",
        field: "actions",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<Movie>) => (
          <div className="flex items-center gap-2">
            <button className="p-1 rounded" title="Movie Poster">
              <ImageIcon className="text-green-400" size={18} />
            </button>
            <button
              onClick={() => {
                setSelectedMovieId(params.data?.id ?? null);
                setIsAddMovieOpen(true);
              }}
              className="p-1 rounded hover:bg-blue-100"
              title="Edit"
            >
              <Edit className="text-blue-400" size={18} />
            </button>
            <button
              onClick={() => {
                setSelectedMovieId(params.data?.id ?? null);
                setSelectedMovieName(params.data?.title ?? "");
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
            Movie Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, search, and filter all your Movies in one place.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedMovieId(null);
            setIsAddMovieOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          + New Movie
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
      {isAddMovieOpen && (
        <AddMovieModal
          onClose={() => {
            setIsAddMovieOpen(false);
            setSelectedMovieId(null);
          }}
          movieId={selectedMovieId ?? undefined}
          onAdd={fetchMovies}
        />
      )}

      {/* Delete Venue Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedMovieId(null);
          setSelectedMovieName("");
        }}
        onConfirm={handleDeleteMovie}
        title="Delete Movie"
        itemName={selectedMovieName}
        itemType="Movie"
        description="This will permanently delete the Movie and all associated data."
      />
    </div>
  );
}
