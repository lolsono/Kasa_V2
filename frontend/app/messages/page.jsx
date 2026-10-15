"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConversationList from "@/components/messages/ConversationList/ConversationList";
import MessageComposer from "@/components/messages/MessageComposer/MessageComposer";
import MessageThread from "@/components/messages/MessageThread/MessageThread";
import { MOCK_CONVERSATIONS } from "@/mocks/messagesMock";
import styles from "./page.module.css";

/**
 * Page de messagerie (`/messages`).
 *
 * - Desktop : la liste des conversations et la conversation ouverte sont
 *   affichées côte à côte (la première conversation est ouverte par défaut).
 * - Mobile (< 768 px) : un seul écran à la fois. On voit d'abord la liste,
 *   puis la conversation après un clic, avec un bouton « Retour » pour revenir.
 *
 * La page s'affiche en plein écran par-dessus le reste du site (z-index élevé).
 * Sur mobile, seules la liste et les messages défilent : la barre d'envoi
 * reste fixe en bas.
 *
 * Les données viennent pour l'instant de `data/messagesMock.js`.
 *
 * @returns {JSX.Element}
 */
export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState(null);

  // Desktop : on affiche la première conversation tant que rien n'est choisi
  const activeConversation =
    conversations.find((conversation) => conversation.id === selectedId) ??
    conversations[0];

  // Mobile : liste tant qu'aucune conversation n'est choisie, puis conversation
  const mobileView = selectedId === null ? "list" : "chat";

  function handleSelect(id) {
    setSelectedId(id);
    // Ouvrir une conversation la marque comme lue
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id ? { ...conversation, unread: false } : conversation
      )
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.layout} data-view={mobileView}>
        <ConversationList
          className={styles.sidebar}
          conversations={conversations}
          activeId={activeConversation?.id}
          onSelect={handleSelect}
          onBack={() => router.back()}
        />

        <section className={styles.chat} aria-label="Conversation">
          {/* Mobile uniquement : retour à la liste des conversations */}
          <button
            type="button"
            className={styles.mobileBack}
            onClick={() => setSelectedId(null)}
          >
            <span aria-hidden="true">←</span> Retour
          </button>

          {activeConversation ? (
            <>
              <MessageThread
                messages={activeConversation.messages}
                avatar={activeConversation.user.picture}
              />
              <MessageComposer />
            </>
          ) : (
            <p className={styles.empty}>Sélectionnez une conversation.</p>
          )}
        </section>
      </div>
    </main>
  );
}
