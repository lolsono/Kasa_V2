/**
 * Données de démonstration pour préparer l'interface de messagerie.
 * À remplacer par les données de l'API (via un service) quand elle sera prête.
 */

const QUESTION = "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?";

/** @type {import("@/types/typedefs").Conversation[]} */
export const MOCK_CONVERSATIONS = [
  {
    id: "c1",
    user: { name: "Utilisateur", picture: null },
    time: "11:04 am",
    unread: true,
    messages: [
      { id: "m1", from: "other", author: "Utilisateur", time: "11:04pm", date: "02 Septembre 2025", text: QUESTION },
      { id: "m2", from: "other", author: "Utilisateur", time: "11:04pm", date: "02 Septembre 2025", text: QUESTION },
      { id: "m3", from: "me", author: "Utilisateur", time: "11:04pm", date: "02 Septembre 2025", text: QUESTION },
      { id: "m4", from: "other", author: "Utilisateur", time: "11:04pm", date: "03 Septembre 2025", text: QUESTION },
      { id: "m5", from: "me", author: "Utilisateur", time: "11:04pm", date: "03 Septembre 2025", text: QUESTION },
      { id: "m6", from: "other", author: "Utilisateur", time: "11:04pm", date: "03 Septembre 2025", text: QUESTION },
    ],
  },
  ...[
    { id: "c2", unread: true },
    { id: "c3", unread: true },
    { id: "c4", unread: false },
    { id: "c5", unread: false },
    { id: "c6", unread: false },
    { id: "c7", unread: false },
    { id: "c8", unread: false },
  ].map(({ id, unread }) => ({
    id,
    user: { name: "Utilisateur", picture: null },
    time: "11:04 am",
    unread,
    messages: [
      { id: `${id}-m1`, from: "other", author: "Utilisateur", time: "11:04pm", date: "03 Septembre 2025", text: QUESTION },
    ],
  })),
];
