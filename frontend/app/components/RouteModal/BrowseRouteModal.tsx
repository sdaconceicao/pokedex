"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { type BrowseSection, buildBrowseUrl } from "@/lib/browseUrls";
import { parsePage } from "@/lib/pagination";
import { parseSort } from "@/lib/sort";
import RouteModal from "./RouteModal";

interface BrowseRouteModalProps {
  section: BrowseSection;
  slug: string;
  children: ReactNode;
}

export default function BrowseRouteModal({ section, slug, children }: BrowseRouteModalProps) {
  const searchParams = useSearchParams();

  const closeHref = buildBrowseUrl(section, slug, {
    page: parsePage(searchParams.get("page")),
    sort: parseSort(searchParams.get("sort")),
  });

  return (
    <RouteModal closeHref={closeHref} showCloseButton={false}>
      {children}
    </RouteModal>
  );
}
