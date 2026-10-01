"use client";

import Link from "next/link";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Connexion() {
  const { login, refreshUser } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login(email, password);
      await refreshUser();
      router.push("/dashboard");
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
