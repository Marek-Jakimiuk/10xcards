import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationDTO } from "../types";

interface PaginationProps {
  pagination: PaginationDTO;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({ pagination, onPageChange, loading = false }: PaginationProps) {
  const { page, limit, total } = pagination;
  const totalPages = Math.ceil(total / limit);

  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const handlePrevious = () => {
    if (canGoPrevious && !loading) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext && !loading) {
      onPageChange(page + 1);
    }
  };

  const handlePageClick = (targetPage: number) => {
    if (targetPage !== page && !loading) {
      onPageChange(targetPage);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between">
      <div className="text-gray-500 italic">
        Pokazano {Math.min((page - 1) * limit + 1, total)} - {Math.min(page * limit, total)} z {total} fiszek
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={!canGoPrevious || loading}
          className="h-12 w-12 p-0"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <span key={`dots-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          const pageNumber = pageNum as number;
          const isCurrentPage = pageNumber === page;

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageClick(pageNumber)}
              disabled={loading}
              className="h-12 min-w-12 px-2"
            >
              {pageNumber}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!canGoNext || loading}
          className="h-12 w-12 p-0"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
