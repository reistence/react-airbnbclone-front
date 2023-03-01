import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import "../styles/general.scss";
import styles from "./header.module.scss";
import logo from "../assets/logo.png";

export default function () {
  const navHeaderList = [
    {
      label: "home",
      link: "/home",
      routeName: "/",
    },
    {
      label: "Ricerca",
      link: "/advancedSearch",
      routeName: "/advancedSearch",
    },
    {
      label: "About",
      routeName: "/about",
      active: false,
    },
  ];

  const [scrollPosition, setScrollPosition] = useState(0);
  function updateScroll() {
    setScrollPosition(window.scrollY);
  }

  window.addEventListener("scroll", updateScroll);

  const [hamMenu, setHamMenu] = useState(false);
  function toggleMenu() {
    if (hamMenu) {
      setHamMenu(false);
    } else {
      setHamMenu(true);
    }
  }

  return (
    <header className={scrollPosition > 50 ? `${styles.faded}` : ""}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logo} alt="Boolking" />
          <span>AirBnB</span>
        </div>

        <nav>
          <ul>
            {navHeaderList.map((hlink, key) => (
              <li key={key}>{hlink.label}</li>
            ))}
            |
            <li className={styles.external}>
              <a href="http://127.0.0.1:8000/login">Login</a>
            </li>
            <li className={styles.external}>
              <a href="http://127.0.0.1:8000/register">Area Riservata</a>
            </li>
          </ul>
        </nav>
        <div className={styles.hamnav}>
          <i className="fa-solid fa-bars" onClick={() => toggleMenu()}></i>
          {hamMenu ? (
            <ul>
              {navHeaderList.map((hlink, key) => (
                <li key={key}>{hlink.label}</li>
              ))}
              <li className={styles.external}>
                <a href="http://127.0.0.1:8000/login">Login</a>
              </li>
              <li className={styles.external}>
                <a href="http://127.0.0.1:8000/register">Area Riservata</a>
              </li>
            </ul>
          ) : null}
        </div>
      </div>
    </header>
  );
}
