"use client";

import { useState } from "react";
import styles from "./MessageComposer.module.css";

/**
 * Zone de saisie d'un message.
 * Entrée envoie le message, Maj + Entrée ajoute un retour à la ligne.
 * Un message vide (ou composé d'espaces) n'est pas envoyé.
 *
 * @param {Object} props
 * @param {(text: string) => void} props.onSend - Appelé avec le texte nettoyé.
 * @returns {JSX.Element}
 */
export default function MessageComposer({ onSend }) {
  const [text, setText] = useState("");

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className={styles.bar}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.field}
          rows={1}
          placeholder="Envoyer un message"
          aria-label="Envoyer un message"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          type="submit"
          className={styles.send}
          aria-label="Envoyer"
          disabled={!text.trim()}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 19V5M5 12l7-7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
