import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Navbar() {
    return (
        <footer className={styles.footer}>
            <Image src="/logo_Black.svg" alt="logo abricot en noir" width={102} height={13}/>
            <p>Abricot 2025</p>
        </footer>
    );
}
