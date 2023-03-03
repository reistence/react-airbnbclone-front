import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "../styles/partials/about.module.scss";
import alessio from "../assets/us/alessio.png";
import fabrizio from "../assets/us/fabrizio.jpg";
import samuele from "../assets/us/samuele.jpeg";
import valerio from "../assets/us/valerio.jpeg";

export default function About() {
  const [conf, setConf] = useState(1);
  const [round, setRound] = useState(5);

  function move() {
    const wrapper = document.querySelector(".wrapper");
    const dataset = wrapper?.dataset;

    const rand = (min, max) =>
      Math.floor(Math.random() * (max - min + 1) + min);

    const uniqueRand = (min, max, prev) => {
      let next = prev;

      while (prev === next) next = rand(min, max);

      return next;
    };

    const combinations = [
      { configuration: 1, roundness: 1 },
      { configuration: 1, roundness: 2 },
      { configuration: 1, roundness: 4 },
      { configuration: 3, roundness: 2 },
      { configuration: 3, roundness: 3 },
      { configuration: 3, roundness: 3 },
      { configuration: 2, roundness: 2 },
      { configuration: 2, roundness: 3 },
      { configuration: 2, roundness: 4 },
      { configuration: 2, roundness: 1 },
    ];

    let prev = 0;

    setInterval(() => {
      const index = uniqueRand(0, combinations.length - 1, prev),
        combination = combinations[index];

      setConf(combination.configuration);
      setRound(combination.roundness);

      prev = index;
      // console.log("moving");
    }, 3000);
  }

  useEffect(() => {
    move();
  }, []);

  // useLayoutEffect(() => {
  //   move();
  // }, []);

  // move();

  return (
    <>
      <div className={styles.container}>
        <h1>About Us</h1>
        <p>
          Boolking nasce come progetto finale del #team7 della classe #73 di
          Boolean. L'intento era quello di sviluppare una piattaforma che
          permettesse agli utenti di registrarsi, inserire, sponsorizzare e
          mettere in mostra le loro proprietà, permettendo agli utenti
          visitatori di navigare, cercare e di contattare i proprietari. Il
          progetto si articola in due macro sezioni, Front-End e Back-End, ed è
          stato realizzato attraverso l'uso di tecnologie apprese durante di sei
          mesi di corso. Il nome è nato il primissimo giorno da un'intuizione di
          Samuele che ha anche dato vita all'animazione del pagamento, la veste
          grafica è in piccola parte uno spunto preso da AirBnB e per la maggior
          parte creazione dell’estro di Valerio, la ricerca per servizi non
          esisterebbe senza Fabrizio, mentre Alessio si è occupato di tener
          testa alla rigida "impalcatura" delle query di Laravel. Il team ha
          legato e lavorato assieme dall’inizio alla fine, tutti hanno
          contribuito ad aggiungere funzionalità e a risolvere problemi, tutto
          ciò che vedete è frutto di una collaborazione totale e questo sito non
          potrebbe esistere se anche solo uno dei membri del team non fosse
          stato presente.<br></br> <br></br>
          <a className="our-btn" href="https://www.patreon.com/Boolking/guys">
            Buy us a coffee
          </a>
          <br></br>
          <br></br> Di seguito potete trovare il link ai profili GitHub di ogni
          membro:
        </p>
        <div
          className={styles.wrapper}
          data-configuration={conf}
          data-roundness={round}
        >
          <div className={styles.shape}>
            <div className={styles.img}>
              <a href="https://github.com/BetterCallAle">
                <img alt="" src={alessio} />
              </a>
            </div>
          </div>
          <div className={styles.shape}>
            <div className={styles.img}>
              <a href="https://github.com/FabrizioMisseri">
                <img alt="" src={fabrizio} />
              </a>
            </div>
          </div>
          <div className={styles.shape}>
            <div className={styles.img}>
              <a href="https://github.com/ImBlindForU">
                <img alt="" src={samuele} />
              </a>
            </div>
          </div>
          <div className={styles.shape}>
            <div className={styles.img}>
              <a href="https://github.com/reistence">
                <img alt="" src={valerio} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.space}></div>
    </>
  );
}
