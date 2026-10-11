import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import styles from "./LogementCard.module.css";

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
