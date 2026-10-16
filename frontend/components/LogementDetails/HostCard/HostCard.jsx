import Link from "next/link";
import Image from "next/image";
import styles from "./HostCard.module.css";

/**
 * @typedef {Object} Host
 * @property {string} name - Nom de l'hôte.
 * @property {string} [picture] - URL de la photo de profil. Si absente,
 *   l'initiale du nom est affichée à la place.
 */

/**
 * Carte de présentation de l'hôte d'un logement : avatar (ou initiale),
 * nom, note moyenne et liens de contact vers la messagerie.
 *
 * Ne rend rien (`null`) si `host` n'est pas fourni.
 * Composant serveur : aucun hook, donc pas de `"use client"`.
 *
 * @component
 * @param {Object} props - Propriétés du composant.
 * @param {Host} [props.host] - Informations sur l'hôte.
 * @param {number|string} [props.rating] - Note moyenne de l'hôte, affichée avec une étoile.
 * @returns {JSX.Element|null} La carte de l'hôte, ou `null` sans hôte.
 *
 * @example
 * <HostCard host={{ name: "Alice", picture: "/alice.jpg" }} rating={4.8} />
 */
export default function HostCard({ host, rating }) {
  if (!host) return null;

  return (
    <aside className={styles.card} aria-labelledby="host-title">
      <h2 id="host-title" className={styles.title}>
        Votre hôte
      </h2>

      <div className={styles.host}>
        <div className={styles.avatar}>
          {host.picture ? (
            <Image
              src={host.picture}
              alt={`Photo de ${host.name}`}
              fill
              sizes="64px"
              className={styles.avatarImage}
            />
          ) : (
            <span className={styles.initial} aria-hidden="true">
              {host.name?.charAt(0)}
            </span>
          )}
        </div>

        <p className={styles.name}>{host.name}</p>

        <p className={styles.rating} aria-label={`Note : ${rating}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="#a63a1e"
            />
          </svg>
          {rating}
        </p>
      </div>

      <div className={styles.actions}>
        <Link href="/messages" className={styles.link}>
          Contacter l’hôte
        </Link>
        <Link href="/messages" className={styles.link}>
          Envoyer un message
        </Link>
      </div>
    </aside>
  );
}
