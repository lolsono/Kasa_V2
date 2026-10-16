import Image from "next/image";
import styles from "./page.module.css";

/**
 * Missions de Kasa, affichées sous forme de liste numérotée.
 * @constant {string[]}
 */
const MISSIONS = [
  "Offrir une plateforme fiable et simple d’utilisation",
  "Proposer des hébergements variés et de qualité",
  "Favoriser des échanges humains et chaleureux entre hôtes et voyageurs",
];

/**
 * Page « À propos » : présentation de Kasa, de ses valeurs et de ses missions.
 *
 * Page statique sans état ni appel API : composant serveur (pas de
 * `"use client"`).
 *
 * @component
 * @returns {JSX.Element} La page « À propos ».
 *
 * @example
 * // Rendue automatiquement par le routeur Next.js sur la route « à propos »
 */
export default function AProposPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>À propos</h1>
          <p className={styles.text}>
            Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où
            se sentir bien.
          </p>
          <p className={styles.text}>
            Depuis notre création, nous mettons en relation des voyageurs en
            quête d’authenticité avec des hôtes passionnés qui aiment partager
            leur région et leurs bonnes adresses.
          </p>
        </header>

        <div className={styles.hero}>
          <Image
            src="/img_apropos_1.svg"
            alt="Maison en bois entourée d’arbres au coucher du soleil"
            fill
            priority
            sizes="(min-width: 1148px) 1100px, 100vw"
            className={styles.image}
          />
        </div>

        <section className={styles.mission}>
          <div className={styles.missionContent}>
            <h2 className={styles.missionTitle}>Notre mission est simple :</h2>

            <ol className={styles.list}>
              {MISSIONS.map((item) => (
                <li key={item} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ol>

            <p className={styles.highlight}>
              Que vous cherchiez un appartement cosy en centre-ville, une maison
              en bord de mer ou un chalet à la montagne, Kasa vous accompagne
              pour que chaque séjour devienne un souvenir inoubliable.
            </p>
          </div>

          <div className={styles.side}>
            <Image
              src="/img_apropos_2.svg"
              alt="Chalet en bois avec grande baie vitrée"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className={styles.image}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
