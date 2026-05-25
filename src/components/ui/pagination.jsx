import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

function Pagination({ className = "", ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={`mx-auto flex w-full justify-center ${className}`}
      {...props}
    />
  );
}

function PaginationContent({ className = "", ...props }) {
  return (
    <ul
      data-slot="pagination-content"
      className={`flex flex-row items-center gap-1 ${className}`}
      {...props}
    />
  );
}

function PaginationItem({ ...props }) {
  return <li data-slot="pagination-item" {...props} />;
}

function PaginationLink({ className = "", isActive, size = "icon", ...props }) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const sizeStyles =
    size === "icon" ? "h-9 w-9" : "h-9 px-4";
  const variantStyles = isActive
    ? "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
    : "text-gray-600 hover:bg-gray-100";

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    />
  );
}

function PaginationPrevious({ className = "", ...props }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={`gap-1 px-2.5 sm:pl-2.5 ${className}`}
      {...props}
    >
      <ChevronLeftIcon className="w-4 h-4" />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({ className = "", ...props }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={`gap-1 px-2.5 sm:pr-2.5 ${className}`}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon className="w-4 h-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className = "", ...props }) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={`flex h-9 w-9 items-center justify-center ${className}`}
      {...props}
    >
      <MoreHorizontalIcon className="w-4 h-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
