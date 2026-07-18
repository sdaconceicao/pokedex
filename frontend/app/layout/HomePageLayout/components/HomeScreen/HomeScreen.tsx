"use client";

import { Bell01, Compass01, UserPlus01 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { useCallback, useRef } from "react";
import Button from "@/components/Button";
import PokeballMark from "@/components/PokeballMark";
import TypeTag from "@/components/TypeTag";
import { useIsAuthenticated } from "@/hooks/useAuth";
import FeatureTile from "@/layout/HomePageLayout/components/FeatureTile";
import { useAuthModal } from "@/providers/AuthModalProvider";
import type { PokemonType } from "@/types";
import styles from "./HomeScreen.module.css";
import { UPDATES } from "./updates";
import { FEATURES } from "./features";

interface HomeScreenProps {
  types: PokemonType[];
}

export const HomeScreen: React.FunctionComponent<HomeScreenProps> = ({
  types,
}) => {
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
        <h1 className={styles.heroTitle}>
          Every Pokémon.
          <span className={styles.heroTitleAccent}>The Poképendium.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Search for every Pokémon by name, browse by type, region, or regional
          Pokedex, and see there full stats, abilities, and special forms.
        </p>
        <div className={styles.heroActions}>
          {isAuthenticated ? (
            <Button size="lg" onClick={scrollToTypes}>
              <Compass01
                width={18}
                height={18}
                className={styles.ctaIcon}
                aria-hidden="true"
              />
              Start exploring
            </Button>
          ) : (
            <Button size="lg" onClick={openSignUp}>
              <UserPlus01
                width={18}
                height={18}
                className={styles.ctaIcon}
                aria-hidden="true"
              />
              Sign Up today
            </Button>
          )}
          <button
            type="button"
            className={styles.heroSecondaryCta}
            onClick={scrollToUpdates}
          >
            <Bell01
              width={18}
              height={18}
              className={styles.ctaIcon}
              aria-hidden="true"
            />
            What&apos;s new
          </button>
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="home-features-heading"
      >
        <p className={styles.sectionEyebrow}>How it works</p>
        <h2 id="home-features-heading" className={styles.sectionTitle}>
          Find your Pokémon
        </h2>
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
        <h2 id="home-types-heading" className={styles.sectionTitle}>
          Start with a type
        </h2>
        <ul className={styles.typeGrid}>
          {types.map((type) => (
            <li key={type.name}>
              <Link
                href={`/?type=${type.name}`}
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
        <h2 id="home-updates-heading" className={styles.sectionTitle}>
          Latest updates
        </h2>
        <ul className={styles.updateList}>
          {UPDATES.map((update) => (
            <li key={update.title} className={styles.updateRow}>
              <time dateTime={update.date} className={styles.updateDate}>
                {update.label}
              </time>
              <div>
                <div className={styles.updateHeader}>
                  <h3 className={styles.updateTitle}>{update.title}</h3>
                  <span
                    className={`${styles.updateTag} ${
                      update.tag === "New"
                        ? styles.updateTagNew
                        : styles.updateTagImproved
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
