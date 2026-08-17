"use client";

import { Button, Heading } from "@code-x/lago";
import { Bell01, Compass01, UserPlus01 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { useCallback, useRef } from "react";
import FeatureTile from "@/components/FeatureTile";
import PokeballMark from "@/components/PokeballMark";
import TypeTag from "@/components/TypeTag";
import { useIsAuthenticated } from "@/hooks/useAuth";
import { useAuthModal } from "@/providers/AuthModalProvider";
import type { PokemonType } from "@/types";
import { FEATURES } from "./features";
import styles from "./HomeScreen.module.css";
import { UPDATES } from "./updates";

interface HomeScreenProps {
  types: PokemonType[];
}

export const HomeScreen: React.FunctionComponent<HomeScreenProps> = ({ types }) => {
  const { isAuthenticated } = useIsAuthenticated();
  const { openSignUp } = useAuthModal();
  const typesSectionRef = useRef<HTMLElement>(null);
  const updatesSectionRef = useRef<HTMLElement>(null);

  const scrollToTypes = useCallback(() => {
    typesSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const scrollToUpdates = useCallback(() => {
    updatesSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <div className={styles.home} data-testid="home-screen">
      <section className={styles.hero}>
        <PokeballMark className={styles.heroPokeball} />
        <p className={styles.eyebrow}>Your Pokémon companion</p>
        <Heading level={1} className={styles.heroTitle}>
          Every Pokémon.
          <span className={styles.heroTitleAccent}>The Poképendium.</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          Search for every Pokémon by name, browse by type, region, or regional Pokedex, and see
          there full stats, abilities, and special forms.
        </p>
        <div className={styles.heroActions}>
          {isAuthenticated ? (
            <Button size="lg" onPress={scrollToTypes}>
              <Compass01 width={18} height={18} className={styles.ctaIcon} aria-hidden="true" />
              Start exploring
            </Button>
          ) : (
            <Button size="lg" onPress={openSignUp}>
              <UserPlus01 width={18} height={18} className={styles.ctaIcon} aria-hidden="true" />
              Sign Up today
            </Button>
          )}
          <button type="button" className={styles.heroSecondaryCta} onClick={scrollToUpdates}>
            <Bell01 width={18} height={18} className={styles.ctaIcon} aria-hidden="true" />
            What&apos;s new
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="home-features-heading">
        <p className={styles.sectionEyebrow}>How it works</p>
        <Heading level={2} id="home-features-heading" className={styles.sectionTitle}>
          Find your Pokémon
        </Heading>
        <ul className={styles.featureGrid}>
          {FEATURES.map((feature) => (
            <FeatureTile key={feature.title} {...feature} />
          ))}
        </ul>
      </section>

      <section
        ref={typesSectionRef}
        className={styles.section}
        aria-labelledby="home-types-heading"
      >
        <p className={styles.sectionEyebrow}>Start exploring</p>
        <Heading level={2} id="home-types-heading" className={styles.sectionTitle}>
          Start with a type
        </Heading>
        <ul className={styles.typeGrid}>
          {types.map((type) => (
            <li key={type.name}>
              <Link
                href={`/type/${type.name}`}
                className={styles.typeLink}
                aria-label={`Browse ${type.name} Pokémon`}
              >
                <TypeTag type={type.name} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        ref={updatesSectionRef}
        className={styles.section}
        aria-labelledby="home-updates-heading"
      >
        <p className={styles.sectionEyebrow}>What&apos;s new</p>
        <Heading level={2} id="home-updates-heading" className={styles.sectionTitle}>
          Latest updates
        </Heading>
        <ul className={styles.updateList}>
          {UPDATES.map((update) => (
            <li key={update.title} className={styles.updateRow}>
              <time dateTime={update.date} className={styles.updateDate}>
                {update.label}
              </time>
              <div>
                <div className={styles.updateHeader}>
                  <Heading level={3} className={styles.updateTitle}>
                    {update.title}
                  </Heading>
                  <span
                    className={`${styles.updateTag} ${
                      update.tag === "New" ? styles.updateTagNew : styles.updateTagImproved
                    }`}
                  >
                    {update.tag}
                  </span>
                </div>
                <p className={styles.updateBody}>{update.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HomeScreen;
