"use client";

import Image from "next/image";
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

                {/* Partie gauche */}
                <section className={styles.formSection}>

                    <div className={styles.logo}>
                        <Image
                            src="/Logo.svg"
                            alt="Abricot"
                            width={105}
                            height={40}
                            priority
                        />
                    </div>

                    <div className={styles.formContainer}>

                        <h1>Connexion</h1>

                        <form onSubmit={handleSubmit}>

                            <div className={styles.inputGroup}>
                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password">
                                    Mot de passe
                                </label>

                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                />
                            </div>

                            {errorMessage && (
                                <p className={styles.errorMessage}>
                                    {errorMessage}
                                </p>
                            )}

                            <button
                                type="submit"
                                className={styles.loginButton}
                            >
                                Se connecter
                            </button>

                            <a
                                href="#"
                                className={styles.forgotPassword}
                            >
                                Mot de passe oublié ?
                            </a>

                        </form>

                    </div>

                    <div className={styles.register}>
                        <span>Pas encore de compte ?</span>

                        <a href="/connexion/signUp">
                            Créer un compte
                        </a>
                    </div>

                </section>

                {/* Partie droite */}
                <section className={styles.imageSection}>
                    <Image
                        src="/background_Log_In.jpg"
                        alt="Bureau avec ordinateur et fournitures"
                        fill
                        priority
                        className={styles.image}
                    />
                </section>

            </div>
        </main>
    );
}
