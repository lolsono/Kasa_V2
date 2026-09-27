import AccountForm from "@/components/account/AccountForm";
import styles from "./compte.module.css";

export default function ComptePage() {
    return (
        <div className={styles.form}>
            <AccountForm />
        </div>
    );
}
