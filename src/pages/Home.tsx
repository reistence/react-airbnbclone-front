import React, {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import { AppContext } from "../Contexts/AppContext";
import axios from "axios";
import styles from "../styles/partials/home.module.scss";
import EstateCard from "../components/EstateCard";
import { useNavigate } from "react-router";
import gsap from "gsap";

export type Estate = {
  address: any;
  bathroom_number: number;
  bed_number: string;
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
  services: object[];
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

  const { setCity } = useContext(AppContext);

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

  const wrap = useRef();
  const tl = useRef();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ defaults: { stagger: 0.5 } })
        .fromTo(
          "#ovunque",
          { opacity: 0, ease: "ease.Out" },
          { opacity: 1, ease: "ease.Out" }
        );
    });
  }, []);

  return (
    <>
      <div className={styles.mycontainerfluid}>
        <div className={styles.container}>
          <div id="ovunque" className={styles.search}>
            <input
              type="text"
              name="city"
              id="city"
              placeholder="Ovunque"
              onKeyUp={(e) => (e.key === "Enter" ? goToAdvanced() : "")}
              onChange={(e) => setCity(e.target.value)}
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
                  slug={estate.slug}
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
                  slug={estate.slug}
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
