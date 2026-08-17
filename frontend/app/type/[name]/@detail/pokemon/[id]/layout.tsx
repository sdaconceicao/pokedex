import type { ReactNode } from "react";
import { BrowseRouteModal } from "@/components/RouteModal";

export default async function Layout(props: {
  children: ReactNode;
  params: Promise<{ name: string }>;
}) {
  const { name } = await props.params;

  return (
    <BrowseRouteModal section="type" slug={decodeURIComponent(name)}>
      {props.children}
    </BrowseRouteModal>
  );
}
