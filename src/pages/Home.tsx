import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/partials/home.module.scss";
import EstateCard from "../components/EstateCard";

export default function Home() {
  const [allEstates, setAllEstates] = useState([]);
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/estates").then((res) => {
      setAllEstates(res.data.results);
    });
    console.log(allEstates);
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
            {allEstates &&
              allEstates.map((estate: object, key: number) => (
                <EstateCard estate={estate} key={key}></EstateCard>
              ))}
          </div>

          <h2>All estates</h2>
          <div className={styles.cardscontainer}>
            {allEstates &&
              allEstates.map((estate: object, key) => (
                <EstateCard estate={estate} key={key}></EstateCard>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
