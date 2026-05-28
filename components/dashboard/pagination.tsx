"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={createPageUrl(1)}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Awal
        </Link>
      )}

      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Sebelumnya
        </Link>
      )}

      {startPage > 1 && <span className="text-gray-500">...</span>}

      {pages.map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`px-3 py-2 rounded-lg ${
            page === currentPage
              ? "bg-gold text-primary font-semibold"
              : "border border-gray-300 hover:bg-gray-100"
          }`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && <span className="text-gray-500">...</span>}

      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Selanjutnya
        </Link>
      )}

      {currentPage < totalPages && (
        <Link
          href={createPageUrl(totalPages)}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Akhir
        </Link>
      )}
    </div>
  );
}
