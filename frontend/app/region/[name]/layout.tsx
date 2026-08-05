import type { ReactNode } from "react";

interface RegionLayoutProps {
  children: ReactNode;
  /** The @detail slot: a Pokemon opened from this region's list. Renders over
   *  the list, so the list keeps its page and its data while the detail is up
   *  and Back simply drops the detail. */
  detail: ReactNode;
}

export default function RegionLayout({ children, detail }: RegionLayoutProps) {
  return (
    <>
      {children}
      {detail}
    </>
  );
}
