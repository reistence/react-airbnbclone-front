import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import styles from "./estatecard.module.scss";

type estateProp = {
  address: any;
  // bathroom_number: number;
  cover_img: string;
  // created_at: string;
  // description: string;
  // detail: string;
  // id: number;
  images: object[];
  is_visible: number;
  // mq: number;
  price: string;
  // room_number: number;
  // slug: string;
  sponsors: object[];
  title: string;
  // type: string;
  // updated_at: string;
  // user: object;
  // user_id: number;
};

type Image = {
  id: number;
  path: string;
};

export default function EstateCard({
  price,
  address,
  title,
  cover_img,
  images,
}: estateProp) {
  if (cover_img.includes("cover/")) {
    cover_img = `http://127.0.0.1:8000/storage/${cover_img}`;
  } else {
    cover_img = cover_img;
  }

  const wrap = useRef();
  const tl = useRef();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ defaults: { stagger: 0.3 } })
        .fromTo(
          ".cad",
          { opacity: 0, ease: "ease.Out" },
          { opacity: 1, ease: "ease.Out" }
        );
    });
  }, []);

  return (
    <>
      <div className={`${styles.estatecard} cad`}>
        <div className={styles.price}>€{Math.trunc(parseInt(price))}</div>
        <div className={styles.estateimg}>
          <img src={cover_img} alt="cover" />

          {images &&
            images.map((img, key) => (
              <img
                src={`http://127.0.0.1:8000/storage/${img?.path}`}
                alt=""
                key={key}
              />
            ))}
        </div>
        <div className={styles.estatetxt}>
          <div>
            <h5>
              {address?.city}, <span>{address?.country}</span>
            </h5>
            <p>{title}</p>
          </div>
        </div>
      </div>
    </>
  );
}
