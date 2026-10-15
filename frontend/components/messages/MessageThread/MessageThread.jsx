import { Fragment, useEffect, useRef } from "react";
import MessageBubble from "../MessageBubble/MessageBubble";
import styles from "./MessageThread.module.css";

/**
 * Liste des messages d'une conversation.
 * Un séparateur avec la date est inséré quand le jour change, et la liste
 * défile automatiquement jusqu'au dernier message.
 *
 * @param {Object} props
 * @param {import("@/types/typedefs").Message[]} props.messages
 * @param {string|null} [props.avatar] - Photo de l'interlocuteur.
 * @returns {JSX.Element}
 */
export default function MessageThread({ messages, avatar = null }) {
  const threadRef = useRef(null);

  // Descend jusqu'au dernier message à l'ouverture et à chaque nouveau message
  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={threadRef}
      className={styles.thread}
      role="log"
      aria-live="polite"
      aria-label="Messages"
    >
      {messages.length === 0 && (
        <p className={styles.empty}>Aucun message pour le moment.</p>
      )}

      {messages.map((message, index) => {
        const previous = messages[index - 1];
        const showSeparator = previous && previous.date !== message.date;

        return (
          <Fragment key={message.id}>
            {showSeparator && (
              <p className={styles.separator}>{message.date}</p>
            )}
            <MessageBubble
              message={message}
              avatar={message.from === "me" ? null : avatar}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
