"use client";

import { useAuth } from "@/context/AuthContext";
import styles from "./AccountForm.module.css";
import { useState } from "react";
import {
    updateProfile,
    updatePassword
} from "@/services/accountService";

export default function AccountForm() {

    const { user, loading, refreshUser } = useAuth();

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!user) {
        return <p>Utilisateur non connecté.</p>;
    }

    async function handleSubmit(event) {

        event.preventDefault();

        // On efface les anciens messages
        setErrorMessage("");
        setSuccessMessage("");

        const formData = new FormData(event.currentTarget);

        const lastname = formData.get("lastname");
        const firstname = formData.get("firstname");
        const email = formData.get("email");
        const password = formData.get("password");
        const passwordNew = formData.get("passwordNew");

        const name = `${firstname} ${lastname}`;

        // Vérification des modifications du profil
        const profileChanged =
            firstname !== user.firstName ||
            lastname !== user.lastName ||
            email !== user.email;

        const passwordChanged =
            password !== "" || passwordNew !== "";

        if (!profileChanged && !passwordChanged) {
            setErrorMessage("Aucune modification à effectuer.");
            return;
        }

        try {

            if (profileChanged) {
                await updateProfile({
                    name,
                    email,
                });
            }

            if (passwordChanged) {

                if (!password || !passwordNew) {
                    throw new Error(
                        "Veuillez renseigner votre mot de passe actuel et votre nouveau mot de passe."
                    );
                }

                await updatePassword({
                    currentPassword: password,
                    newPassword: passwordNew,
                });
            }
            await refreshUser();

            if (profileChanged && passwordChanged) {
                setSuccessMessage(
                    "Vos informations et votre mot de passe ont été modifiés."
                );
            } else if (profileChanged) {
                setSuccessMessage(
                    "Vos informations ont été modifiées."
                );
            } else if (passwordChanged) {
                setSuccessMessage(
                    "Votre mot de passe a été modifié."
                );
            }

        } catch (error) {

            console.error("ERREUR :", error);

            setErrorMessage(
                error.message || "Une erreur est survenue."
            );
        }
    }

    return (
        <section className={styles.container}>

            <div className={styles.header}>
                <h1>Mon compte</h1>

                <p>
                    {user.firstName} {user.lastName}
                </p>
            </div>

            <form onSubmit={handleSubmit}>

                <div className={styles.inputGroup}>
                    <label htmlFor="lastname">
                        Nom
                    </label>

                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        defaultValue={user.lastName}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="firstname">
                        Prénom
                    </label>

                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        defaultValue={user.firstName}
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
                        defaultValue={user.email}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">
                        Mot de passe actuel
                    </label>

                    <input
                        type="password"
                        id="password"
                        name="password"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="passwordNew">
                        Nouveau mot de passe
                    </label>

                    <input
                        type="password"
                        id="passwordNew"
                        name="passwordNew"
                    />
                </div>

                {errorMessage && (
                    <p className={styles.errorMessage}>
                        {errorMessage}
                    </p>
                )}

                {successMessage && (
                    <p className={styles.successMessage}>
                        {successMessage}
                    </p>
                )}

                <button
                    type="submit"
                    className={styles.button}
                >
                    Modifier les informations
                </button>

            </form>

        </section>
    );
}
