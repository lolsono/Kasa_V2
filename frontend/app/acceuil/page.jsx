"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LogementCard from "@/components/LogementCard/LogementCard.jsx";
import { getLogements } from "@/services/logementServices";
import styles from "./page.module.css";

/**
 * @typedef {Object} Step
 * @property {string} title - Titre de l'étape.
 * @property {string} text - Texte explicatif de l'étape.
 */

/**
 * Étapes affichées dans la section « Comment ça marche ? ».
 * @constant {Step[]}
 */
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

/**
 * Page d'accueil : présentation de Kasa, liste des logements et section
 * « Comment ça marche ? ».
 *
 * Au montage, charge les logements via le service `getLogements` puis affiche
 * selon l'état :
 * - un message de chargement tant que la requête est en cours ;
 * - un message d'erreur si la récupération échoue ;
 * - un message « Aucun logement à afficher » si la liste est vide ;
 * - sinon une grille de `LogementCard`.
 *
 * Composant client (`"use client"`) car il utilise des hooks React.
 *
 * @component
 * @returns {JSX.Element} La page d'accueil.
 *
 * @example
 * // Rendue automatiquement par le routeur Next.js sur /acceuil
 */
export default function HomePage() {
  /** @type {[Object[], Function]} Liste des logements récupérés depuis l'API. */
  const [logements, setLogements] = useState([]);

  /** @type {[boolean, Function]} `true` tant que la requête est en cours. */
  const [loading, setLoading] = useState(true);

  /** @type {[boolean, Function]} `true` si la récupération des logements a échoué. */
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    /**
     * Charge la liste des logements et met à jour les états
     * `logements`, `hasError` et `loading`.
     *
     * @async
     * @returns {Promise<void>}
     */
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
