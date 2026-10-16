"use client";

import Link from "next/link";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Page de connexion.
 *
 * Affiche un formulaire (email, mot de passe). À la soumission :
 * 1. appelle `login` fourni par le contexte d'authentification ;
 * 2. met à jour l'utilisateur courant via `refreshUser` ;
 * 3. redirige vers la page d'accueil.
 *
 * En cas d'échec, le message d'erreur est affiché dans le formulaire
 * (`role="alert"`). La page propose aussi des liens vers « Mot de passe
 * oublié » et vers l'inscription.
 *
 * Composant client (`"use client"`) car il utilise des hooks et gère un formulaire.
 *
 * @component
 * @returns {JSX.Element} La page de connexion.
 *
 * @example
 * // Rendue automatiquement par le routeur Next.js sur /connexion/login
 */
export default function Connexion() {
  /** Fonctions du contexte d'authentification : connexion et rechargement de l'utilisateur. */
  const { login, refreshUser } = useAuth();

  /** Routeur Next.js, utilisé pour la redirection après connexion. */
  const router = useRouter();

  /** @type {[string, Function]} Message d'erreur affiché sous le formulaire (vide si aucune erreur). */
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Gère la soumission du formulaire de connexion.
   *
   * Lit l'email et le mot de passe, connecte l'utilisateur, rafraîchit
   * l'utilisateur courant puis redirige vers `/acceuil`. En cas d'erreur,
   * affiche le message retourné par le service.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} event - Événement de soumission du formulaire.
   * @returns {Promise<void>}
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login(email, password);
      await refreshUser();
      router.push("/acceuil");
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Heureux de vous revoir</h1>
        <p className={styles.subtitle}>
          Connectez-vous pour retrouver vos réservations, vos annonces et tout
          ce qui rend vos séjours uniques.
        </p>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </div>

          {errorMessage && (
            <p className={styles.errorMessage} role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className={styles.loginButton}>
            Se connecter
          </button>

          <Link
            href="/connexion/mot-de-passe-oublie"
            className={styles.forgotPassword}
          >
            Mot de passe oublié
          </Link>
        </form>

        <p className={styles.register}>
          Pas encore de compte ?{" "}
          <Link href="/connexion/signUp">Inscrivez-vous</Link>
        </p>
      </div>
    </main>
  );
}
