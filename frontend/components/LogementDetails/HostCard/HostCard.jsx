import Image from "next/image";
import styles from "./HostCard.module.css";

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
        <button type="button" className={styles.button}>
          Contacter l’hôte
        </button>
        <button type="button" className={styles.button}>
          Envoyer un message
        </button>
      </div>
    </aside>
  );
}
