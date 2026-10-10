import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1>404</h1>

        <p>
          Il semble que la page que vous cherchez ait pris
          <br />
          des vacances... ou n'ait jamais existé.
        </p>

        <div className={styles.buttons}>
          <a href="/acceuil" className={styles.button}>
            Accueil
          </a>

          <a href="/logements" className={styles.button}>
            Logements
          </a>
        </div>
      </div>
    </main>
  );
}
