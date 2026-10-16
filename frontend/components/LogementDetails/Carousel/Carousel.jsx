"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Carousel.module.css";

/**
 * Durée de l'animation de transition entre deux images, en millisecondes.
 * Doit rester cohérente avec l'animation CSS / le style inline du track.
 * @constant {number}
 */
export const DURATION = 450;

/**
 * Carrousel d'images accessible avec boucle infinie.
 *
 * Fonctionnement : la liste des slides est entourée de deux clones
 * (`[dernière, ...images, première]`). Quand on arrive sur un clone, on
 * revient *sans animation* sur l'image réelle correspondante, ce qui donne
 * l'illusion d'une boucle continue.
 *
 * Navigation possible :
 * - flèches « précédent » / « suivant » ;
 * - touches clavier `ArrowLeft` / `ArrowRight` (carrousel focusable) ;
 * - balayage tactile (swipe) de plus de 50 px.
 *
 * Comportements particuliers :
 * - si `pictures` est vide, `cover` est utilisée comme unique image ;
 * - si aucune image n'est disponible, le composant ne rend rien ;
 * - avec une seule image, ni flèches, ni compteur, ni clones ne sont affichés.
 *
 * @component
 * @param {Object} props - Propriétés du composant.
 * @param {string[]} [props.pictures=[]] - URLs des images à afficher.
 * @param {string} [props.cover] - Image de secours utilisée si `pictures` est vide.
 * @param {string} props.title - Titre du logement, utilisé pour les libellés ARIA et les `alt`.
 * @returns {JSX.Element|null} Le carrousel, ou `null` s'il n'y a aucune image.
 *
 * @example
 * <Carousel
 *   pictures={["/a.jpg", "/b.jpg", "/c.jpg"]}
 *   cover="/a.jpg"
 *   title="Appartement lumineux"
 * />
 */
export default function Carousel({ pictures = [], cover, title }) {
  const images = (pictures.length > 0 ? pictures : [cover]).filter(Boolean);
  const total = images.length;
  const hasMany = total > 1;

  /**
   * Position courante dans la liste des slides (clones inclus).
   * 1 = première vraie image ; 0 et `total + 1` correspondent aux clones.
   */
  const [position, setPosition] = useState(1);

  /** Active ou non la transition CSS (désactivée lors du saut depuis un clone). */
  const [animated, setAnimated] = useState(true);

  /** Verrou empêchant de déclencher plusieurs déplacements pendant une animation. */
  const lockedRef = useRef(false);

  /** Référence du timer de fin d'animation, nettoyé au démontage. */
  const timeoutRef = useRef(null);

  /** Coordonnée X du début du geste tactile (`null` si aucun geste en cours). */
  const touchStartX = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  if (total === 0) return null;

  // [dernière, ...images, première] pour pouvoir boucler en douceur
  const slides = hasMany ? [images[total - 1], ...images, images[0]] : images;

  /** Numéro (1-indexé) de l'image réellement affichée, utilisé par le compteur. */
  const current = !hasMany
    ? 1
    : position === 0
      ? total
      : position === total + 1
        ? 1
        : position;

  /**
   * Déplace le carrousel d'une image dans la direction donnée.
   * Ignoré s'il n'y a qu'une image ou si une animation est déjà en cours.
   * Après l'animation, si on se trouve sur un clone, on revient sans
   * animation sur l'image réelle équivalente.
   *
   * @param {-1|1} direction - `-1` pour l'image précédente, `1` pour la suivante.
   * @returns {void}
   */
  function move(direction) {
    if (!hasMany || lockedRef.current) return;

    lockedRef.current = true;
    const next = position + direction;
    setAnimated(true);
    setPosition(next);

    timeoutRef.current = setTimeout(() => {
      // Arrivé sur un clone : on revient sans animation sur la vraie image
      if (next === 0 || next === total + 1) {
        setAnimated(false);
        setPosition(next === 0 ? total : 1);
      }
      requestAnimationFrame(() => {
        lockedRef.current = false;
      });
    }, DURATION);
  }

  /**
   * Gère la navigation au clavier (flèches gauche / droite).
   *
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier.
   * @returns {void}
   */
  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  }

  /**
   * Mémorise la position horizontale du début d'un geste tactile.
   *
   * @param {React.TouchEvent<HTMLDivElement>} event - Événement `touchstart`.
   * @returns {void}
   */
  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
  }

  /**
   * Termine un geste tactile : si le déplacement horizontal dépasse 50 px,
   * change d'image (swipe gauche → suivante, swipe droite → précédente).
   *
   * @param {React.TouchEvent<HTMLDivElement>} event - Événement `touchend`.
   * @returns {void}
   */
  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1);
  }

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carrousel"
      aria-label={`Photos de ${title}`}
      tabIndex={hasMany ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      <div
        className={styles.viewport}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={styles.track}
          style={{
            transform: `translateX(-${hasMany ? position * 100 : 0}%)`,
            transition: animated
              ? `transform ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : "none",
          }}
        >
          {slides.map((src, index) => {
            const isClone = hasMany && (index === 0 || index === total + 1);
            const realIndex = hasMany ? index : index + 1;

            return (
              <div
                key={`${index}-${src}`}
                className={styles.slide}
                aria-hidden={isClone || undefined}
              >
                <Image
                  src={src}
                  alt={
                    isClone ? "" : `${title} - photo ${realIndex} sur ${total}`
                  }
                  fill
                  priority={index === (hasMany ? 1 : 0)}
                  sizes="(min-width: 768px) 650px, 100vw"
                  className={styles.image}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>

      {hasMany && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            onClick={() => move(-1)}
            aria-label="Image précédente"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => move(1)}
            aria-label="Image suivante"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <p className={styles.counter} aria-live="polite">
            {current} / {total}
          </p>
        </>
      )}
    </div>
  );
}
