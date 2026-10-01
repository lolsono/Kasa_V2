import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Image src="/logo_house.svg" alt="logo maison en rouge" width={46} height={54}/>
            <p>© 2025 Kasa. All rights reserved</p>
        </footer>
    );
}
