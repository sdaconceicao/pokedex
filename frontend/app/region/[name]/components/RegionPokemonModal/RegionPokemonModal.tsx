"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback } from "react";
import { Modal } from "@/components/Modal";
import { buildRegionUrl, parsePage } from "../RegionPokemon/RegionPokemon.utils";
import styles from "./RegionPokemonModal.module.css";

interface RegionPokemonModalProps {
  children: ReactNode;
}

/** Holds a Pokemon's detail over the region it was opened from. Dismissing
 *  goes to the region's own URL rather than back through history, so a link
 *  opened cold has somewhere to land too. */
export default function RegionPokemonModal({ children }: RegionPokemonModalProps) {
  const router = useRouter();
  const params = useParams<{ name: string }>();
  const searchParams = useSearchParams();

  const handleClose = useCallback(() => {
    const region = decodeURIComponent(params.name);
    // replace, not push: closing shouldn't leave the detail on the stack for
    // Back to walk into again
    router.replace(buildRegionUrl(region, parsePage(searchParams.get("page"))), { scroll: false });
  }, [router, params.name, searchParams]);

  return (
    <Modal isOpen onClose={handleClose} size="xl" className={styles.modal}>
      {children}
    </Modal>
  );
}
