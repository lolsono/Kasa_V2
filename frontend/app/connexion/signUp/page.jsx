"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./singUp.module.css";
import { useState } from "react";
import { signUpServices } from "@/services/signUp.services";
import { useAuth } from "@/context/AuthContext";

/**
 * Page d'inscription (création d'un compte client).
 *
 * Affiche un formulaire (nom, prénom, email, mot de passe de 8 caractères
 * minimum, acceptation des CGU). À la soumission :
 * 1. appelle le service `signUpServices` ;
 * 2. met à jour l'utilisateur courant via `refreshUser` (contexte d'authentification) ;
 * 3. redirige vers la page d'accueil.
 *
 * En cas d'échec, le message d'erreur est affiché dans le formulaire
 * (`role="alert"`).
 *
 * Composant client (`"use client"`) car il utilise des hooks et gère un formulaire.
 *
 * @component
 * @returns {JSX.Element} La page d'inscription.
 *
 * @example
 * // Rendue automatiquement par le routeur Next.js sur /connexion/signUp
 */
export default function SignUp() {
  /** Fonction du contexte d'authentification qui recharge l'utilisateur connecté. */
  const { refreshUser } = useAuth();

  /** Routeur Next.js, utilisé pour la redirection après inscription. */
  const router = useRouter();

  /** @type {[string, Function]} Message d'erreur affiché sous le formulaire (vide si aucune erreur). */
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Gère la soumission du formulaire d'inscription.
   *
   * Lit les champs du formulaire, crée le compte, rafraîchit l'utilisateur
   * puis redirige vers `/acceuil`. En cas d'erreur, affiche le message
   * retourné par le service.
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

    //Fusion du lastName et FirstName
    //const firstName = formData.get("firstName");
    //const lastName = formData.get("lastName");
    const name = formData.get("firstName");

    try {
      await signUpServices(name, email, password);
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
        <h1>Rejoignez la communauté Kasa</h1>
        <p className={styles.subtitle}>
          Créez votre compte et commencez à voyager autrement : réservez des
          logements uniques, découvrez de nouvelles destinations et partagez vos
          propres lieux avec d’autres voyageurs.
        </p>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              required
            />
          </div>

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
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className={styles.terms}>
            <input type="checkbox" id="terms" name="terms" required />
            <label htmlFor="terms">
              J’accepte les{" "}
              <Link href="/conditions-generales">
                conditions générales d’utilisation
              </Link>
            </label>
          </div>

          {errorMessage && (
            <p className={styles.errorMessage} role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className={styles.submitButton}>
            S’inscrire
          </button>
        </form>

        <p className={styles.login}>
          Déjà membre ? <Link href="/connexion/login">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}
