import React, { useLayoutEffect, useState } from "react";

import styles from "../styles/partials/notfound.module.scss";

export default function NotFound() {
  const [MousePosition, setMousePosition] = useState({ left: 0, top: 0 });
  function handleMouseMove(ev) {
    setMousePosition({ left: ev.pageX, top: ev.pageY });
  }
  const left = document.querySelector(".leftside");
  document.onmousemove = (e) => handleMouseMove(e);

  return (
    <>
      <div
        className={`${styles.side} ${styles.leftside}`}
        onMouseMove={(ev) => handleMouseMove(ev)}
        style={{
          width: `${(MousePosition.left / window.innerWidth) * 100}%`,
        }}
      >
        <h2 className={styles.title}>
          4<i className="fa-brands fa-airbnb"></i>4 - Not{" "}
          <span className={styles.fancy}>Found</span>
        </h2>
      </div>
      <div className={`${styles.side} ${styles.rightside}`}>
        <h2 className={styles.title}>
          4<i className="fa-brands fa-airbnb"></i>4 - Not{" "}
          <span className={styles.fancy}>Found</span>
        </h2>
      </div>
    </>
  );
}
