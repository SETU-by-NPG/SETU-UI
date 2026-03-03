import { useState, type ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: (item: T) => string;
  searchPlaceholder?: string;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  actions?: ReactNode;
  emptyState?: ReactNode;
}

export function DataTable<T extends { id?: string }>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Search...",
  pageSize: controlledPageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  actions,
  emptyState,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [internalPageSize, setInternalPageSize] = useState(10);

  // Use controlled page size if provided, otherwise use internal state
  const pageSize = controlledPageSize ?? internalPageSize;

  const filtered = searchKey
    ? data.filter((item) => searchKey(item).toLowerCase().includes(search.toLowerCase()))
    : data;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {searchKey && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-input-background"
              style={{ fontSize: "0.875rem" }}
            />
          </div>
        )}
        {actions && <div className="flex gap-2 sm:ml-auto">{actions}</div>}
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left px-4 py-3 text-muted-foreground ${col.className || ""}`}
                    style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground" style={{ fontSize: "0.875rem" }}>
                    No results found
                  </td>
                </tr>
              ) : (
                paged.map((item, idx) => (
                  <tr
                    key={(item as any).id || idx}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 ${col.className || ""}`} style={{ fontSize: "0.875rem" }}>
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {(totalPages > 1 || filtered.length > 10) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3">
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
              Showing {filtered.length > 0 ? page * pageSize + 1 : 0}-{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
            </p>
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <label className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Rows:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  const newPageSize = Number(e.target.value);
                  if (onPageSizeChange) {
                    onPageSizeChange(newPageSize);
                  } else {
                    setInternalPageSize(newPageSize);
                  }
                  setPage(0); // Reset to first page when changing page size
                }}
                className="px-2 py-1 rounded-md border border-border bg-input-background text-foreground"
                style={{ fontSize: "0.75rem" }}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-md hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-md hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
