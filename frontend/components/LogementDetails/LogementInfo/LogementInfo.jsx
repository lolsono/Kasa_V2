import Collapse from "@/components/LogementDetails/Collapse/Collapse";
import styles from "./LogementInfo.module.css";

/**
 * Liste de « pastilles » (chips) placée dans un panneau repliable.
 * Composant interne à ce fichier, non exporté.
 *
 * Ne rend rien si `items` est vide ou absent.
 *
 * @private
 * @param {Object} props - Propriétés du composant.
 * @param {string} props.title - Titre du panneau repliable.
 * @param {string[]} [props.items] - Éléments affichés (utilisés aussi comme `key`, ils doivent donc être uniques).
 * @returns {JSX.Element|null} Le panneau avec ses pastilles, ou `null` si la liste est vide.
 */
function ChipList({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <Collapse title={title}>
      <ul className={styles.chips}>
        {items.map((item) => (
          <li key={item} className={styles.chip}>
            {item}
          </li>
        ))}
      </ul>
    </Collapse>
  );
}

/**
 * Carte d'informations détaillées d'un logement : titre (h1), localisation,
 * description, puis deux panneaux repliables « Équipements » et « Catégorie »
 * (masqués si les listes correspondantes sont vides).
 *
 * @component
 * @param {Object} props - Propriétés du composant.
 * @param {string} props.title - Titre de l'annonce.
 * @param {string} props.location - Localisation du logement.
 * @param {string} props.description - Description complète du logement.
 * @param {string[]} [props.equipments] - Équipements disponibles.
 * @param {string[]} [props.tags] - Catégories / étiquettes du logement.
 * @returns {JSX.Element} La carte d'informations du logement.
 *
 * @example
 * <LogementInfo
 *   title="Appartement lumineux"
 *   location="Lyon, Croix-Rousse"
 *   description="Idéal pour un week-end."
 *   equipments={["Wi-Fi", "Cuisine équipée"]}
 *   tags={["Appartement", "Centre-ville"]}
 * />
 */
export default function LogementInfo({
  title,
  location,
  description,
  equipments,
  tags,
}) {
  return (
    <article className={styles.card}>
      <h1 className={styles.title}>{title}</h1>

      <p className={styles.location}>
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
            fill="none"
            stroke="#8a8a8a"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="10"
            r="2.5"
            fill="none"
            stroke="#8a8a8a"
            strokeWidth="2"
          />
        </svg>
        {location}
      </p>

      <p className={styles.description}>{description}</p>

      <ChipList title="Équipements" items={equipments} />
      <ChipList title="Catégorie" items={tags} />
    </article>
  );
}
