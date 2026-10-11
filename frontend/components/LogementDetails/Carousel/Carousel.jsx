"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Carousel.module.css";

const DURATION = 450; // ms, doit rester cohérent avec l'animation

export default function Carousel({ pictures = [], cover, title }) {
  const images = (pictures.length > 0 ? pictures : [cover]).filter(Boolean);
  const total = images.length;
  const hasMany = total > 1;

  // position 1 = première vraie image (0 et total + 1 sont des clones)
  const [position, setPosition] = useState(1);
  const [animated, setAnimated] = useState(true);
  const lockedRef = useRef(false);
  const timeoutRef = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  if (total === 0) return null;

  // [dernière, ...images, première] pour pouvoir boucler en douceur
  const slides = hasMany ? [images[total - 1], ...images, images[0]] : images;

  const current = !hasMany
    ? 1
    : position === 0
      ? total
      : position === total + 1
        ? 1
        : position;

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

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  }

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
  }

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
                  alt={isClone ? "" : `${title} - photo ${realIndex} sur ${total}`}
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
