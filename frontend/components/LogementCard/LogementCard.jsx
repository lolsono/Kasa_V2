import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import styles from "./LogementCard.module.css";

/**
 * Carte d'un logement : image, titre, localisation et prix par nuit.
 * Toute la carte est cliquable et mène à `/logements/{id}`.
 * Le bouton cœur (`FavoriteButton`) lit lui-même l'état des favoris dans le
 * Context : la carte n'a pas besoin de le connaître.
 *
 * @param {Object} props
 * @param {import("@/types/typedefs").Logement} props.logement
 * @returns {JSX.Element}
 */
export default function LogementCard({ logement }) {
  const { id, title, cover, location, price_per_night } = logement;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={cover}
          alt={title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className={styles.image}
        />
      </div>

      <FavoriteButton id={id} title={title} />

      <div className={styles.body}>
        <h2 className={styles.title}>
          {/* Le lien couvre toute la carte (voir ::after dans le CSS) */}
          <Link href={`/logements/${id}`} className={styles.link}>
            {title}
          </Link>
        </h2>
        <p className={styles.location}>{location}</p>
        <p className={styles.price}>
          <strong>{price_per_night}€</strong> <span>par nuit</span>
        </p>
      </div>
    </article>
  );
}
