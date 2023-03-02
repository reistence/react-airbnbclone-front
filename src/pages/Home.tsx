import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/partials/home.module.scss";
import EstateCard from "../components/EstateCard";

type Estate = {
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
  const [allEstates, setAllEstates] = useState<Estate[]>([]);
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/estates").then((res) => {
      setAllEstates([...res.data.results]);
      console.log(allEstates);
    });
    // console.log(allEstates);
  }, []);

  return (
    <>
      <div className={styles.mycontainerfluid}>
        <div className={styles.container}>
          <div className={styles.search}>
            <input type="text" name="" id="" placeholder="Ovunque" />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          <h2>In evidenza</h2>
          <div className={styles.cardscontainer}>
            {allEstates
              ? allEstates.map((estate, key: number) => (
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
                ))
              : null}
          </div>

          <h2>All estates</h2>
          <div className={styles.cardscontainer}>
            {allEstates &&
              allEstates.map((estate, key) => (
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
