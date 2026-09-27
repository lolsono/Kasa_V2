"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./singUp.module.css";
import { useState } from "react";
import { signUpServices } from "@/services/signUp.services";
import { useAuth } from "@/context/AuthContext";

export default function SignUp() {

    const { refreshUser } = useAuth();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event) {

        event.preventDefault();

        setErrorMessage("");

        const formData = new FormData(event.currentTarget);

        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");

        try {
            await signUpServices(name, email, password);
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

                        <h1>Inscription</h1>

                        <form onSubmit={handleSubmit}>

                            <div className={styles.inputGroup}>
                                <label htmlFor="name">
                                    Name
                                </label>

                                <input
                                    type="name"
                                    id="name"
                                    name="name"
                                />
                            </div>

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
                                S’inscrire
                            </button>

                        </form>

                    </div>

                    <div className={styles.register}>
                        <span>Déjà inscrit ?</span>

                        <a href="/connexion/login">
                            Se connecter
                        </a>
                    </div>

                </section>


                {/* Partie droite */}
                <section className={styles.imageSection}>
                    <Image
                        src="/background_Sign_Up.jpg"
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


