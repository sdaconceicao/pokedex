"use client";

import { Avatar, Select, SelectItem, Text } from "@code-x/lago";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Key } from "react-aria-components";
import { formatFormName } from "@/lib/formNames";
import type { PokemonForm } from "@/types";
import styles from "./FormSelect.module.css";
import { buildFormHref } from "./FormSelect.utils";

interface FormSelectProps {
  forms?: PokemonForm[];
  currentId: string;
  speciesId: string;
  speciesName: string;
  className?: string;
}

export function FormSelect({
  forms,
  currentId,
  speciesId,
  speciesName,
  className,
}: FormSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!forms || forms.length < 2) return null;

  const handleChange = (key: Key | null) => {
    if (key == null) return;

    const formId = String(key);
    if (formId === currentId) return;

    router.replace(buildFormHref(pathname, searchParams.toString(), { speciesId, formId }), {
      scroll: false,
    });
  };

  return (
    <Select
      size="sm"
      value={currentId}
      onChange={handleChange}
      label="Form"
      className={[styles.select, className].filter(Boolean).join(" ")}
    >
      {forms.map((form) => {
        const label = formatFormName(form.name, speciesName);

        return (
          <SelectItem key={form.id} id={form.id} textValue={label}>
            <Avatar
              src={form.image}
              alt=""
              name={label}
              size="sm"
              shape="square"
              className={styles.sprite}
            />
            <Text slot="label">{label}</Text>
          </SelectItem>
        );
      })}
    </Select>
  );
}

export default FormSelect;
