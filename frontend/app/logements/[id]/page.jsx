"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Carousel from "@/components/LogementDetails/Carousel/Carousel";
import HostCard from "@/components/LogementDetails/HostCard/HostCard";
import LogementInfo from "@/components/LogementDetails/LogementInfo/LogementInfo";
import { getLogementById } from "@/services/logementServices";
import styles from "./page.module.css";

/**
 * @typedef {Object} Host
 * @property {string} name - Nom complet de l'hôte.
 * @property {string} [picture] - URL de la photo de profil (optionnelle).
 */

/**
 * @typedef {Object} Logement
 * @property {string} id - Identifiant unique du logement.
 * @property {string} title - Titre de l'annonce.
 * @property {string} cover - URL de l'image de couverture.
 * @property {string[]} pictures - URLs des photos du logement.
 * @property {string} location - Localisation affichée (ville, quartier…).
 * @property {string} description - Description complète du logement.
 * @property {string[]} equipments - Liste des équipements proposés.
 * @property {string[]} tags - Catégories associées au logement.
 * @property {Host} host - Hôte du logement.
 * @property {number|string} rating_avg - Note moyenne de l'hôte.
 */

/**
 * Page de détail d'un logement (route dynamique `/logement/[id]`).
 *
 * Récupère l'identifiant dans l'URL via `useParams`, charge le logement
 * grâce au service `getLogementById` puis affiche, selon l'état :
 * - un message de chargement tant que la requête est en cours ;
 * - un message « introuvable » si l'API répond avec un statut 404 ;
 * - un message d'erreur générique pour toute autre erreur ;
 * - sinon le détail : carrousel, informations et carte de l'hôte.
 *
 * Composant client (`"use client"`) car il utilise des hooks React.
 *
 * @component
 * @returns {JSX.Element} La page de détail du logement.
 *
 * @example
 * // Rendue automatiquement par le routeur Next.js sur /logement/abc123
 * // app/logement/[id]/page.jsx
 */
export default function LogementPage() {
  /** @type {{ id?: string }} Paramètres de la route dynamique. */
  const { id } = useParams();

  /** @type {[Logement|null, Function]} Logement chargé depuis l'API. */
  const [logement, setLogement] = useState(null);

  /** @type {[boolean, Function]} `true` tant que la requête est en cours. */
  const [loading, setLoading] = useState(true);

  /**
   * Type d'erreur rencontrée : `"notFound"` (404), `"error"` (autre) ou
   * `null` si tout s'est bien passé.
   * @type {[("notFound"|"error"|null), Function]}
   */
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    /**
     * Charge le logement correspondant à l'`id` et met à jour les états
     * `logement`, `error` et `loading`.
     *
     * @async
     * @returns {Promise<void>}
     */
    async function load() {
      try {
        const data = await getLogementById(id);
        setLogement(data);
      } catch (err) {
        console.error("Erreur getLogementById :", err);
        setError(err.status === 404 ? "notFound" : "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/acceuil" className={styles.back}>
          ← Retour aux annonces
        </Link>

        {loading ? (
          <p className={styles.message}>Chargement du logement…</p>
        ) : error === "notFound" ? (
          <p className={styles.message}>Ce logement est introuvable.</p>
        ) : error ? (
          <p className={styles.message}>
            Le logement n’est pas disponible pour le moment. Réessayez dans
            quelques instants.
          </p>
        ) : (
          <div className={styles.layout}>
            <div className={styles.main}>
              <Carousel
                pictures={logement.pictures}
                cover={logement.cover}
                title={logement.title}
              />
              <LogementInfo
                title={logement.title}
                location={logement.location}
                description={logement.description}
                equipments={logement.equipments}
                tags={logement.tags}
              />
            </div>

            <div className={styles.side}>
              <HostCard host={logement.host} rating={logement.rating_avg} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
