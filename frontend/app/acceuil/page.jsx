"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LogementCard from "@/components/LogementCard/LogementCard.jsx";
import { getLogements } from "@/services/logementServices";
import styles from "./page.module.css";

/* Pour l'affichage des cards d'explication */
const STEPS = [
  {
    title: "Recherchez",
    text: "Entrez votre destination, vos dates et laissez Kasa faire le reste",
  },
  {
    title: "Réservez",
    text: "Profitez d’une plateforme sécurisée et de profils d’hôtes vérifiés.",
  },
  {
    title: "Vivez l’expérience",
    text: "Installez-vous, profitez de votre séjour, et sentez-vous chez vous, partout.",
  },
];

export default function HomePage() {
  const [logements, setLogements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getLogements();
        setLogements(data);
      } catch (error) {
        console.error("Erreur getLogements :", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Chez vous, partout et ailleurs</h1>
          <p className={styles.subtitle}>
            Avec Kasa, vivez des séjours uniques dans des hébergements
            chaleureux, sélectionnés avec soin par nos hôtes.
          </p>
        </header>

        <div className={styles.hero}>
          <Image
            src="/img_artc_logement.svg"
            alt="Maison en bois sombre dans les dunes"
            fill
            priority
            sizes="(min-width: 1148px) 1100px, 100vw"
            className={styles.heroImage}
          />
        </div>

        {loading ? (
          <p className={styles.message}>Chargement des logements…</p>
        ) : hasError ? (
          <p className={styles.message}>
            Les logements ne sont pas disponibles pour le moment. Réessayez dans
            quelques instants.
          </p>
        ) : logements.length === 0 ? (
          <p className={styles.message}>Aucun logement à afficher.</p>
        ) : (
          <section className={styles.grid} aria-label="Logements">
            {logements.map((logement) => (
              <LogementCard key={logement.id} logement={logement} />
            ))}
          </section>
        )}

        <section className={styles.how} aria-labelledby="how-title">
          <h2 id="how-title" className={styles.howTitle}>
            Comment ça marche ?
          </h2>
          <p className={styles.howSubtitle}>
            Que vous partiez pour un week-end improvisé, des vacances en famille
            ou un voyage professionnel, Kasa vous aide à trouver un lieu qui
            vous ressemble.
          </p>

          <ul className={styles.howSteps}>
            {STEPS.map((step) => (
              <li key={step.title} className={styles.howStep}>
                <h3 className={styles.howStepTitle}>{step.title}</h3>
                <p className={styles.howStepText}>{step.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
