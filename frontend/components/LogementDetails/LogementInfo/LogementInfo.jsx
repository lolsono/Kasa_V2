import Collapse from "@/components/LogementDetails/Collapse/Collapse";
import styles from "./LogementInfo.module.css";

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
