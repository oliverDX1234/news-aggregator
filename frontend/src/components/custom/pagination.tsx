"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import {
  Pagination,
  PaginationItem,
  PaginationContent,
} from "@/components/ui/pagination";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  className?: string;
  page: number;
  totalItems: number;
  totalPages: number;
  handlePagination: (newPage: number) => void;
}

export default function PaginationComponent({
  className,
  page,
  totalItems,
  totalPages,
  handlePagination,
}: PaginationProps) {
  const [activePages, setActivePages] = useState<(number | string)[]>([]);

  const updateActivePages = () => {
    const width = window.innerWidth;

    if (width > 767) {
      if (totalPages <= 5) {
        setActivePages(Array.from({ length: totalPages }, (_, i) => i));
      } else if (page >= totalPages - 3) {
        setActivePages([
          0,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
        ]);
      } else if (page > 2) {
        setActivePages([
          0,
          "...",
          page - 1,
          page,
          page + 1,
          "...",
          totalPages - 1,
        ]);
      } else {
        setActivePages([0, 1, 2, "...", totalPages - 1]);
      }
    } else {
      if (totalPages <= 3) {
        setActivePages(Array.from({ length: totalPages }, (_, i) => i));
      } else if (page >= totalPages - 3) {
        setActivePages([
          0,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
        ]);
      } else if (page > 1) {
        setActivePages([0, "...", page, page + 1, "...", totalPages - 1]);
      } else {
        setActivePages([0, 1, 2, "...", totalPages - 1]);
      }
    }
  };

  useEffect(() => {
    updateActivePages();

    const handleResize = () => {
      updateActivePages();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [page, totalPages]);

  function changePage(newPage: number) {
    if (newPage < 0 || newPage >= totalPages) return;

    handlePagination(newPage);
  }

  return (
    <Pagination className={cn("mt-14 mb-4 text-white", className)}>
      <PaginationContent className="flex-col-reverse md:flex-row flex-1 justify-center gap-4 md:gap-2">
        <p className="text-[#7C8DFF] text-[16px]">
          {totalItems === 0
            ? "0 - 0"
            : `${page * 9 + 1} - ${Math.min(
                (page + 1) * 9,
                totalItems
              )} of ${totalItems}`}
        </p>

        <div className="flex justify-center gap-1 xs:gap-2">
          <PaginationItem onClick={() => changePage(page - 1)}>
            <div
              className={`rounded-[12px] border p-1 h-8 w-8 xs:h-9 xs:w-9 sm:w-11 sm:h-11 flex justify-center items-center ${
                page > 0
                  ? "text-primary cursor-pointer border-primary"
                  : "border-neutral-400"
              }`}
            >
              <ChevronLeft
                size={20}
                strokeWidth={1.5}
                className={`${page > 0 ? "text-primary" : "text-neutral-400"}`}
              />
            </div>
          </PaginationItem>

          <div className="flex gap-1 xs:gap-2 items-center">
            {activePages.map((activePage, index) => {
              if (typeof activePage === "number") {
                return (
                  <PaginationItem
                    key={index}
                    className={`flex items-center justify-center cursor-pointer rounded-[12px] text-[#5152FB] text-[16px] leading-[16px] text-center border border-primary py-2.5 px-2 h-8 w-8 xs:h-9 xs:w-9 sm:w-11 sm:h-11 ${
                      activePage === page
                        ? "text-brand-purple bg-primary border-none"
                        : ""
                    }`}
                    onClick={() => changePage(activePage)}
                  >
                    {activePage + 1}
                  </PaginationItem>
                );
              } else {
                return (
                  <PaginationItem
                    key={index}
                    className="text-[#7C8DFF] text-[16px] leading-16px"
                  >
                    ...
                  </PaginationItem>
                );
              }
            })}
          </div>

          <PaginationItem onClick={() => changePage(page + 1)}>
            <div
              className={`rounded-[12px] border p-1 h-8 w-8 xs:h-9 xs:w-9 sm:w-11 sm:h-11 flex justify-center items-center ${
                page < totalPages - 1
                  ? "text-primary cursor-pointer border-primary"
                  : "border-neutral-400"
              }`}
            >
              <ChevronRight
                size={20}
                strokeWidth={1.5}
                className={`${
                  page < totalPages - 1 ? "text-primary" : "text-neutral-400"
                }`}
              />
            </div>
          </PaginationItem>
        </div>
      </PaginationContent>
    </Pagination>
  );
}
