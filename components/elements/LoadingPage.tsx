export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />

        {/* Brand Text */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Loading</h1>
          <p className="mt-1 text-sm text-gray-500">Please wait a moment…</p>
        </div>
      </div>
    </div>
  );
}
