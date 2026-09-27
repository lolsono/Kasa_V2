"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {

    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const menuRef = useRef(null);
    const mobileNavRef = useRef(null);

    const initials = user
        ? `${user.lastName?.[0] || ""}${user.firstName?.[0] || ""}`
        : "";

    const isCompteActive = pathname.startsWith("/dashboard");
    const isProjetActive = pathname.startsWith("/projet");

    // Ferme les menus si on clique en dehors
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }

            if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
                setMobileNavOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Ferme le menu mobile quand on change de page
    useEffect(() => {
        setMobileNavOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        setMenuOpen(false);
        setMobileNavOpen(false);
        logout();
        router.push("/connexion/login");
    };

    const navLinks = (
        <>
            <Link
                href="/dashboard"
                className={isCompteActive ? styles.active : ""}
                onClick={() => setMobileNavOpen(false)}
            >
                <span className={styles.icon}>
                    <Image
                        src={
                            isCompteActive
                                ? "/logo_dashboard_white.svg"
                                : "/logo_dashboard_orange.svg"
                        }
                        alt="logo du tableau de bord"
                        className={styles.navIcon}
                        width={24}
                        height={24}
                    />
                </span>
                Tableau de bord
            </Link>

            <Link
                href="/projet"
                className={isProjetActive ? styles.active : ""}
                onClick={() => setMobileNavOpen(false)}
            >
                <span className={styles.icon}>
                    <Image
                        src={
                            isProjetActive
                                ? "/logo_folder_white.svg"
                                : "/logo_folder_orange.svg"
                        }
                        alt="logo de dossier"
                        className={styles.navIcon}
                        width={24}
                        height={24}
                    />
                </span>
                Projets
            </Link>
        </>
    );

    return (
        <nav className={styles.navbar}>

            <Link href="/compte" className={styles.logoLink}>
                <Image
                    src="/Logo.svg"
                    alt="Abricot"
                    className={styles.logoAbricot}
                    width={148}
                    height={19}
                />
            </Link>

            {/* Navigation desktop */}
            <div className={styles.links}>
                {navLinks}
            </div>

            <div className={styles.rightSide}>

                {/* Bouton hamburger (mobile uniquement) */}
                <div className={styles.mobileNavWrapper} ref={mobileNavRef}>

                    <button
                        type="button"
                        className={styles.hamburgerButton}
                        onClick={() => {
                            setMobileNavOpen((prev) => !prev);
                            setMenuOpen(false);
                        }}
                        aria-haspopup="true"
                        aria-expanded={mobileNavOpen}
                        aria-label="Ouvrir le menu de navigation"
                    >
                        <span
                            className={`${styles.hamburgerBar} ${
                                mobileNavOpen ? styles.hamburgerBarTop : ""
                            }`}
                        />
                        <span
                            className={`${styles.hamburgerBar} ${
                                mobileNavOpen ? styles.hamburgerBarMiddleHidden : ""
                            }`}
                        />
                        <span
                            className={`${styles.hamburgerBar} ${
                                mobileNavOpen ? styles.hamburgerBarBottom : ""
                            }`}
                        />
                    </button>

                    {mobileNavOpen && (
                        <div className={styles.mobileNavMenu}>
                            {navLinks}
                        </div>
                    )}

                </div>

                <div className={styles.userWrapper} ref={menuRef}>

                    <button
                        className={styles.user}
                        onClick={() => {
                            setMenuOpen((prev) => !prev);
                            setMobileNavOpen(false);
                        }}
                        aria-haspopup="true"
                        aria-expanded={menuOpen}
                    >
                        {initials}
                    </button>

                    {menuOpen && (
                        <div className={styles.userMenu}>

                            <Link
                                href="/compte"
                                className={styles.userMenuItem}
                                onClick={() => setMenuOpen(false)}
                            >
                                Voir mon compte
                            </Link>

                            <button
                                className={`${styles.userMenuItem} ${styles.logoutItem}`}
                                onClick={handleLogout}
                            >
                                Se déconnecter
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </nav>
    );
}
