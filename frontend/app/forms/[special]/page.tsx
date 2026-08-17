import { notFound } from "next/navigation";
import { Suspense } from "react";
import { parseSpecial, SPECIAL_TITLES, SPECIALS } from "@/lib/specials";
import FormsResults from "./components/FormsResults";
import styles from "./page.module.css";

export const generateStaticParams = () => SPECIALS.map((special) => ({ special }));

export async function generateMetadata(props: { params: Promise<{ special: string }> }) {
  const { special } = await props.params;
  const parsed = parseSpecial(special);

  return { title: parsed ? SPECIAL_TITLES[parsed] : "Forms" };
}

export default async function Page(props: { params: Promise<{ special: string }> }) {
  const { special } = await props.params;
  const parsed = parseSpecial(special);

  if (!parsed) notFound();

  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <FormsResults key={parsed} special={parsed} />
      </Suspense>
    </div>
  );
}
