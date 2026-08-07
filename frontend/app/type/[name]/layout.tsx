import type { ReactNode } from "react";

interface TypeLayoutProps {
  children: ReactNode;
  /** The @detail slot: a Pokemon opened from this type's list. Renders over the
   *  list, so the list keeps its page and its data while the detail is up and
   *  Back simply drops the detail. */
  detail: ReactNode;
}

export default function TypeLayout({ children, detail }: TypeLayoutProps) {
  return (
    <>
      {children}
      {detail}
    </>
  );
}
