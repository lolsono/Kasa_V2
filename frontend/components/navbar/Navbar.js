"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Ferme le menu mobile à chaque changement de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      {/* ================= DESKTOP ================= */}
      <nav className={styles.desktop} aria-label="Navigation principale">
        <div className={styles.left}>
          <Link href="/" className={styles.link}>
            Accueil
          </Link>
          <Link href="/a-propos" className={styles.link}>
            À propos
          </Link>
        </div>

        <Link href="/" className={styles.logo} aria-label="Kasa - accueil">
          <Image
            src="/logo_kasa.svg"
            alt="Kasa"
            width={72}
            height={26}
            priority
          />
        </Link>

        <div className={styles.right}>
          <Link href="/logements/nouveau" className={styles.addLink}>
            + Ajouter un logement
          </Link>
          <Link
            href="/favoris"
            className={styles.iconLink}
            aria-label="Favoris"
          >
            <Image
              src="/icone_heart_red.svg"
              alt="logo coeur rouge"
              width={16}
              height={16}
              priority
            />
          </Link>
          <span className={styles.spacer}>|</span>
          <Link
            href="/messages"
            className={styles.iconLink}
            aria-label="Messages"
          >
            <Image
              src="/icone_tchat_red.svg"
              alt="logo tchat rouge"
              width={16}
              height={16}
              priority
            />
          </Link>
        </div>
      </nav>

      {/* ================= MOBILE ================= */}
      <div className={styles.mobile}>
        <div className={styles.mobileBar}>
          <Link href="/" aria-label="Kasa - accueil">
            <Image
              src="logo_house.svg"
              alt="Kasa"
              width={30}
              height={32}
              priority
            />
          </Link>

          <button
            type="button"
            className={styles.burger}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span
              className={`${styles.burgerLine} ${open ? styles.lineTop : ""}`}
            />
            <span
              className={`${styles.burgerLine} ${styles.lineShort} ${open ? styles.lineMiddle : ""}`}
            />
            <span
              className={`${styles.burgerLine} ${open ? styles.lineBottom : ""}`}
            />
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`${styles.menu} ${open ? styles.menuOpen : ""}`}
        >
          <Link href="/" className={styles.menuLink}>
            Accueil
          </Link>
          <Link href="/a-propos" className={styles.menuLink}>
            À propos
          </Link>
          <Link href="/logements/nouveau" className={styles.menuLink}>
            + Ajouter un logement
          </Link>
          <Link href="/favoris" className={styles.menuLink}>
            Favoris
          </Link>
          <Link href="/messages" className={styles.menuLink}>
            Messages
          </Link>
        </div>
      </div>
    </header>
  );
}
