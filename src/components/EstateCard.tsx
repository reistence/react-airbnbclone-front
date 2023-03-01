import React from "react";
import styles from "./estatecard.module.scss";

// type estateProp = {
//   address: object;
//   bathroom_number: number;
//   cover_img: string;
//   created_at: string;
//   description: string;
//   detail: string;
//   id: number;
//   images: object[];
//   is_visible: number;
//   mq: number;
//   price: string;
//   room_number: number;
//   slug: string;
//   sponsors: object[];
//   title: string;
//   type: string;
//   updated_at: string;
//   user: object;
//   user_id: number;
// };

export default function EstateCard({ estate }) {
  return (
    <>
      <div className={styles.estatecard}>
        <div className={styles.price}>€{Math.trunc(estate.price)}</div>
        <div className={styles.estateimg}>
          {/* <img src={estate.cover_img} alt="cover" /> */}
          {/* <img src="" alt="altre" /> */}
        </div>
        <div className={styles.estatetxt}>
          <div>
            <h5>
              {estate.address.city}, <span>{estate.address.country}</span>
            </h5>
            <p>{estate.title}</p>
          </div>
        </div>
      </div>
    </>
  );
}
