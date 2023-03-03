import React, { useEffect, useState } from "react";

import axios from "axios";
import styles from "../styles/partials/home.module.scss";
import EstateCard from "../components/EstateCard";
import { useNavigate } from "react-router";

export type Estate = {
  address: any;
  bathroom_number: number;
  cover_img: string;
  created_at: string;
  description: string;
  detail: string;
  id: number;
  images: object[];
  is_visible: number;
  mq: number;
  price: string;
  room_number: number;
  slug: string;
  sponsors: object[];
  title: string;
  type: string;
  updated_at: string;
  user: object;
  user_id: number;
};

export default function Home() {
  const [unSponsoredEstates, setUnSponsoredEstates] = useState<Estate[]>([]);
  const [sponsoredEstates, setSponsoredEstates] = useState<Estate[]>([]);
  let now = Date.now();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/estates").then((res) => {
      setSponsoredEstates([]);
      setUnSponsoredEstates([]);
      if (res.data.success) {
        // console.log(res.data.results);

        for (let i = 0; i < res.data.results.length; i++) {
          const element = res.data.results[i];

          if (element.sponsors.length > 0) {
            for (let j = 0; j < element.sponsors.length; j++) {
              const sponsoredElement = element.sponsors[j];

              let parsedElement = Date.parse(sponsoredElement.pivot.end_date);
              // console.log("TCHECK", parsedElement, now);

              if (parsedElement > now && !sponsoredEstates.includes(element)) {
                setSponsoredEstates((prev) => [...prev, element]);
              } else if (
                !unSponsoredEstates.filter((e) => e.id === element.id)
              ) {
                setUnSponsoredEstates((prev) => [...prev, element]);
              } else if (!sponsoredEstates.filter((e) => e.id === element.id)) {
                setSponsoredEstates((prev) => [...prev, element]);
              }
            }
          } else {
            setUnSponsoredEstates((prev) => [...prev, element]);
            // console.log(unSponsoredEstates, "LAST IF");
          }
          setUnSponsoredEstates((prev) => [...new Set(prev)]);
        }
      }
      // setSponsoredEstates((prev) => [...new Set(prev)]);
    });
    // console.log(unSponsoredEstates, "UN");
    // console.log(sponsoredEstates, "SP");
  }, []);
  const navigate = useNavigate();

  function goToAdvanced() {
    navigate("/advancedSearch");
  }

  return (
    <>
      <div className={styles.mycontainerfluid}>
        <div className={styles.container}>
          <div className={styles.search}>
            <input
              type="text"
              name=""
              id=""
              placeholder="Ovunque"
              onKeyUp={(e) => (e.key === "Enter" ? goToAdvanced() : "")}
            />
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={goToAdvanced}
            ></i>
          </div>

          <h2>In evidenza</h2>
          <div className={styles.cardscontainer}>
            {sponsoredEstates &&
              sponsoredEstates.map((estate, key) => (
                <EstateCard
                  title={estate?.title}
                  is_visible={estate.is_visible}
                  price={estate.price}
                  address={estate?.address}
                  sponsors={estate.sponsors}
                  cover_img={estate.cover_img}
                  images={estate.images}
                  key={key}
                ></EstateCard>
              ))}
          </div>

          <h2>All estates</h2>
          <div className={styles.cardscontainer}>
            {unSponsoredEstates &&
              unSponsoredEstates.map((estate, key) => (
                <EstateCard
                  title={estate?.title}
                  is_visible={estate.is_visible}
                  price={estate.price}
                  address={estate?.address}
                  sponsors={estate.sponsors}
                  cover_img={estate.cover_img}
                  images={estate.images}
                  key={key}
                ></EstateCard>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
