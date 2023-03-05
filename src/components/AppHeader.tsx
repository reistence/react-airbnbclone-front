import React, { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import "../styles/general.scss";
import styles from "./header.module.scss";
import logo from "../assets/logo.png";

export default function () {
  const navHeaderList = [
    {
      label: "home",
      link: "/",
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
    setHamMenu(false);
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
    <header className={scrollPosition > 20 ? `${styles.faded}` : ""}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logo} alt="Boolking" />
          <span>AirBnB</span>
        </div>

        <nav>
          <ul>
            {navHeaderList &&
              navHeaderList.map((hlink, key) => (
                <li key={key}>
                  <Link to={hlink.routeName}> {hlink.label}</Link>
                </li>
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
              {navHeaderList &&
                navHeaderList.map((hlink, key) => (
                  <li key={key}>
                    <Link to={hlink.routeName}> {hlink.label}</Link>
                  </li>
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
