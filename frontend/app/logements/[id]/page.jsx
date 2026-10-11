"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Carousel from "@/components/LogementDetails/Carousel/Carousel";
import HostCard from "@/components/LogementDetails/HostCard/HostCard";
import LogementInfo from "@/components/LogementDetails/LogementInfo/LogementInfo";
import { getLogementById } from "@/services/logementServices";
import styles from "./page.module.css";

export default function LogementPage() {
  const { id } = useParams();
  const [logement, setLogement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const data = await getLogementById(id);
        setLogement(data);
      } catch (err) {
        console.error("Erreur getLogementById :", err);
        setError(err.status === 404 ? "notFound" : "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/acceuil" className={styles.back}>
          ← Retour aux annonces
        </Link>

        {loading ? (
          <p className={styles.message}>Chargement du logement…</p>
        ) : error === "notFound" ? (
          <p className={styles.message}>Ce logement est introuvable.</p>
        ) : error ? (
          <p className={styles.message}>
            Le logement n’est pas disponible pour le moment. Réessayez dans
            quelques instants.
          </p>
        ) : (
          <div className={styles.layout}>
            <div className={styles.main}>
              <Carousel
                pictures={logement.pictures}
                cover={logement.cover}
                title={logement.title}
              />
              <LogementInfo
                title={logement.title}
                location={logement.location}
                description={logement.description}
                equipments={logement.equipments}
                tags={logement.tags}
              />
            </div>

            <div className={styles.side}>
              <HostCard host={logement.host} rating={logement.rating_avg} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
