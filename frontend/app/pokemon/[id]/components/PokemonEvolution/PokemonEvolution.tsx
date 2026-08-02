import Image from "next/image";
import Link from "next/link";
import { formatPokemonName } from "@/components/PokemonCard/PokemonCard.utils";
import type { EvolutionChain, EvolutionNode } from "@/types/graphql";
import styles from "./PokemonEvolution.module.css";
import { getEvolutionCondition } from "./PokemonEvolution.utils";

interface PokemonEvolutionProps {
  evolution: EvolutionChain;
  currentId: string;
}

interface StageProps {
  node: EvolutionNode;
  isCurrent: boolean;
}

/** A single Pokemon in the chain. The current Pokemon is highlighted and not
 *  linked; every other stage links to its own detail page. */
const EvolutionStage = ({ node, isCurrent }: StageProps) => {
  const dexNumber = `#${String(node.id).padStart(3, "0")}`;
  const content = (
    <>
      <div className={styles.stageImageWrap}>
        <Image
          src={node.image}
          alt={node.name}
          width={96}
          height={96}
          className={styles.stageImage}
        />
      </div>
      <span className={styles.stageName}>{formatPokemonName(node.name)}</span>
      <span className={styles.stageNumber}>{dexNumber}</span>
    </>
  );

  if (isCurrent) {
    return (
      <div className={`${styles.stage} ${styles.current}`} aria-current="page">
        {content}
      </div>
    );
  }

  return (
    <Link href={`/pokemon/${node.id}`} className={styles.stage}>
      {content}
    </Link>
  );
};

interface BranchProps {
  node: EvolutionNode;
  currentId: string;
}

const EvolutionBranch = ({ node, currentId }: BranchProps) => {
  const children = node.evolvesTo ?? [];

  return (
    <div className={styles.branch}>
      <EvolutionStage node={node} isCurrent={node.id === currentId} />
      {children.length > 0 && (
        <div className={styles.transitions}>
          {children.map((child) => {
            const condition = getEvolutionCondition(child);
            return (
              <div key={child.id} className={styles.transition}>
                <div className={styles.arrow}>
                  {condition && <span className={styles.arrowCondition}>{condition}</span>}
                  <span className={styles.arrowLine} aria-hidden="true">
                    →
                  </span>
                </div>
                <EvolutionBranch node={child} currentId={currentId} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Assumes the chain has at least one evolution
export const PokemonEvolution = ({ evolution, currentId }: PokemonEvolutionProps) => (
  <div className={styles.chain} data-testid="pokemon-evolution">
    <EvolutionBranch node={evolution.chain} currentId={currentId} />
  </div>
);

export default PokemonEvolution;
