import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/partials/estatepage.module.scss";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";
import { Estate } from "./Home";

export default function EstatePage() {
  const { slug } = useParams();
  const [singleEstate, setSingleEstate] = useState<Estate>();
  const [loader, setLoader] = useState(false);

  function imgPath(path: string) {
    if (singleEstate?.cover_img.includes("cover/")) {
      return `http://127.0.0.1:8000/storage/${singleEstate.cover_img}`;
    } else {
      return singleEstate?.cover_img;
    }
  }

  useLayoutEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/estates/${slug}`).then((resp) => {
      if (resp.data.success) {
        setSingleEstate(resp.data.results);
        // iniMap();
        console.log(singleEstate);
        setLoader(true);
      }
    });
  }, []);

  const mapRef = useRef();
  const [map, setMap] = useState({});

  useEffect(() => {
    if (singleEstate) {
      iniMap();
    }
  }, [singleEstate]);

  function iniMap() {
    let center: number[] = [];

    if (singleEstate) {
      center = [singleEstate.address.long, singleEstate.address.lat];
    } else {
      center = [12.4964, 41.9028];
    }

    let map = tt.map({
      key: "e3ENGW4vH2FBakpfksCRV16OTNwyZh0e",
      container: document.getElementById("tommap"),
      center: center,
      zoom: 9,
    });
    const markerElement = document.createElement("div");
    markerElement.id = "marker";
    const logo = new URL("../assets/marker.png", import.meta.url).href;
    markerElement.style.backgroundImage = `url(${logo})`;
    markerElement.style.width = "30px";
    markerElement.style.padding = ".5em";

    markerElement.style.height = "30px";
    markerElement.style.backgroundSize = "cover";
    markerElement.style.borderRadius = "20px";
    const marker = new tt.Marker({ element: markerElement, anchor: "center" })
      .setLngLat([singleEstate?.address.long, singleEstate?.address.lat])
      .addTo(map);
    const popupOffsets = {
      top: [0, 0],
      bottom: [0, -15],
      "bottom-right": [0, -70],
      "bottom-left": [0, -70],
      left: [25, -35],
      right: [-25, -35],
    };

    //custom popup
    const customPopUp = document.createElement("div");
    customPopUp.id = "my-pop-up";
    customPopUp.innerHTML = `<p> <a href="/estate/${singleEstate?.slug}"> ${
      singleEstate?.title
    }</a>  </br> ${
      singleEstate?.price ? singleEstate?.price : "Non specificato"
    } </p>`;
    customPopUp.style.color = "black";
    customPopUp.style.width = "150px";

    // const popup = new tt.Popup({ offset: popupOffsets, closeOnMove: true }).setDOMContent(customPopUp)
    const popup = new tt.Popup({
      offset: popupOffsets,
      closeOnMove: true,
    }).setDOMContent(customPopUp);

    marker.setPopup(popup);
  }

  const [processing, setProcessing] = useState(false);
  const [sent, setSent] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function sendForm(event) {
    event.preventDefault();
    console.log("sending");

    setProcessing(true);
    const data = {
      name: name,
      email: email,
      message: message,
      estate_id: singleEstate?.id,
    };

    axios.post("http://127.0.0.1:8000/api/leads", data).then((resp) => {
      if (resp.data.success) {
        document.getElementById("messForm")?.reset();
      }

      setTimeout(() => {
        setProcessing(false);
      }, 1000);

      setSent(true);
      console.log("sent");
    });
  }

  return (
    <>
      <div className={styles.container}>
        <h1>{singleEstate?.title}</h1>
        <div className={styles.estateshowimg}>
          <section>
            <div className={styles.wide}>
              <div className={styles.swiper}>
                <div className={styles.swiperwrapper}>
                  <>
                    <div className={styles.swiperslide}>
                      <figure>
                        <img src={imgPath(singleEstate?.cover_img)} alt="" />
                      </figure>
                    </div>
                    {singleEstate?.images.map((img, key) => {
                      <div className={styles.swiperslide} key={key}>
                        <figure>
                          <img
                            src={`http://127.0.0.1:8000/storage/${img?.path}`}
                            alt=""
                          />
                        </figure>
                      </div>;
                    })}
                  </>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className={styles.containertext}>
          <div className={styles.estateshowtxt}>
            <p>
              {" "}
              <span>Tipologia:</span> {singleEstate?.type}
            </p>
            <p>
              {" "}
              <span>Metri Quadri:</span> {singleEstate?.mq}&#x33A1;
            </p>
            {singleEstate?.price && (
              <p>
                <span>Prezzo:</span> €{singleEstate.price} a notte
              </p>
            )}
            {singleEstate?.room_number && (
              <p>
                <span>Stanze:</span> {singleEstate.room_number}
              </p>
            )}
            {singleEstate?.bed_number && (
              <p>
                <span>Camere da letto:</span> {singleEstate.bed_number}
              </p>
            )}
            {singleEstate?.bathroom_number && (
              <p>
                <span>Bagni:</span> {singleEstate.bathroom_number}
              </p>
            )}
            {singleEstate?.description && (
              <p>
                <span>Descrizione:</span> {singleEstate.description}
              </p>
            )}
            {loader && (
              <>
                {singleEstate.services && (
                  <>
                    <p>
                      <span>Servizi:</span>
                    </p>
                    <ul className={styles.services}>
                      {singleEstate?.services?.map((ser, key) => {
                        <li key={key}>
                          <span>
                            <i className="fa-brands fa-airbnb"></i>
                          </span>
                          {ser.name}
                        </li>;
                      })}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
          <div className={styles.additional}>
            <div className={styles.tommap} id="tommap" ref={mapRef}></div>
            <div className={styles.messageshowbox}>
              <form id="messForm" onSubmit={sendForm} method="POST">
                <input
                  name="name"
                  id="name"
                  required
                  // v-model="name"
                  placeholder="Nome"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  name="email"
                  id="email"
                  required
                  // v-model="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                />
                <textarea
                  name="message"
                  required
                  id="message"
                  // v-model="message"
                  placeholder="Messaggio"
                  onChange={(e) => setMessage(e.target.value)}
                  cols={30}
                  rows={10}
                ></textarea>
                <button
                  className={
                    processing
                      ? `${styles.loading} ${styles.btn}`
                      : `${styles.btn} `
                  }
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  <span className={styles.text}>Invia Messaggio</span>
                  <span className={styles.loadinganimate}></span>
                </button>
              </form>
              {sent && <p>Messaggio inviato</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
