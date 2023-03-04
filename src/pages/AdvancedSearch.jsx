import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
import { AppContext } from "../Contexts/AppContext";
import { gsap } from "gsap";
import axios from "axios";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";
import styles from "../styles/partials/adsearch.module.scss";
import EstateCard from "../components/EstateCard";

export default function AdvancedSearch() {
  const { city, setCity } = useContext(AppContext);
  const [allEstates, setAllEstates] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [sponsoredEstates, setSponsoredEstates] = useState([]);
  const [unSponsoredEstates, setUnSponsoredEstates] = useState([]);
  const [distance, setDistance] = useState(15);
  let address, rooms, beds;
  const now = new Date();
  const [bho, setBho] = useState(false);

  //tom map
  const mapElement = useRef();
  const [map, setMap] = useState({});

  //services
  const [allServices, setAllServices] = useState([]);
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/services").then((res) => {
      res.data.results && setAllServices(res.data.results);
    });
  }, []);

  // search and sort
  function handleSubmit(event) {
    event.preventDefault();
    setAllEstates([]);
    setSponsoredEstates([]);
    setUnSponsoredEstates([]);
    // sponsoredEstates = [];
    // unSponsoredEstates = [];

    setCity(event.target.elements.city.value);
    address = event.target.elements.address.value;
    rooms = event.target.elements.room_number.value;
    beds = event.target.elements.bed_number.value;
    // setDistance(event.target.elements.distance.value);

    const options = {
      params: {
        ...(filteredServices && { services: filteredServices }),
      },
    };

    if (city) {
      options.params.city = city;
    } else {
      options.params.city = null;
    }

    if (distance) {
      options.params.distance = distance;
    } else {
      options.params.distance = 20;
    }

    if (address) {
      options.params.street = address;
    } else {
      options.params.street = null;
    }

    if (rooms) {
      options.params.room_number = rooms;
    } else {
      options.params.room_number = null;
    }

    if (beds) {
      options.params.bed_number = beds;
    } else {
      options.params.bed_number = null;
    }

    axios.get("http://127.0.0.1:8000/api/estates", options).then((res) => {
      setAllEstates([]);
      // console.log(options, "OPTIONS");
      if (res.data.success) {
        setAllEstates(res.data.results);
        // console.log("filtrati", allEstates);
        console.log(res.data.results);

        for (let i = 0; i < res.data.results.length; i++) {
          const element = res.data.results[i];

          if (element.sponsors.length > 0) {
            for (let j = 0; j < element.sponsors.length; j++) {
              const sponsoredElement = element.sponsors[j];

              let parsedElement = Date.parse(sponsoredElement.pivot.end_date);
              if (
                parsedElement > Date.parse(now) &&
                !sponsoredEstates.includes(element)
              ) {
                setSponsoredEstates((prev) => [...prev, element]);
              } else if (
                !unSponsoredEstates.filter((e) => e.id === element.id)
              ) {
                setUnSponsoredEstates((prev) => [...prev, element]);
                // console.table(
                //   !unSponsoredEstates.includes(element),
                //   unSponsoredEstates,
                //   "OOOOO"
                // );
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

      return unSponsoredEstates, sponsoredEstates;
      // console.log(unSponsoredEstates, "uns");
      // console.log(sponsoredEstates, "s");
    });
  }

  useEffect(() => {
    const options = {
      params: {
        ...(filteredServices && { services: filteredServices }),
      },
    };

    if (city) {
      options.params.city = city;
    } else {
      options.params.city = null;
    }

    options.params.distance = 20;

    axios.get("http://127.0.0.1:8000/api/estates", options).then((res) => {
      setAllEstates([]);
      // console.log(options, "OPTIONS");
      if (res.data.success) {
        setAllEstates(res.data.results);
        // console.log("filtrati", allEstates);
        console.log(res.data.results);

        for (let i = 0; i < allEstates.length; i++) {
          const element = allEstates[i];

          if (element.sponsors.length > 0) {
            for (let j = 0; j < element.sponsors.length; j++) {
              const sponsoredElement = element.sponsors[j];

              let parsedElement = Date.parse(sponsoredElement.pivot.end_date);
              if (
                parsedElement > Date.parse(now) &&
                !sponsoredEstates.includes(element)
              ) {
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
        }
        setUnSponsoredEstates((prev) => [...new Set(prev)]);
        setSponsoredEstates((prev) => [...new Set(prev)]);
      }

      console.log(unSponsoredEstates, "uns");
      console.log(sponsoredEstates, "s");
    });
  }, [allServices]);

  // map ini
  useEffect(() => {
    let center = [];

    if (allEstates.length > 0) {
      // console.log(allEstates.length);
      center = [allEstates[0].address.long, allEstates[0].address.lat];
    } else {
      center = [12.4964, 41.9028];
    }

    let map = tt.map({
      key: "e3ENGW4vH2FBakpfksCRV16OTNwyZh0e",
      container: document.getElementById("map"),
      center: center,
      zoom: 5,
    });

    allEstates.forEach((estate) => {
      const markerElement = document.createElement("div");
      markerElement.id = "marker";
      const logo = new URL("../assets/marker.png", import.meta.url).href;
      markerElement.style.backgroundImage = `url(${logo})`;
      markerElement.style.width = "30px";
      markerElement.style.height = "30px";
      markerElement.style.backgroundSize = "cover";
      markerElement.style.borderRadius = "20px";
      const marker = new tt.Marker({ element: markerElement, anchor: "center" })
        .setLngLat([estate.address.long, estate.address.lat])
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
      customPopUp.innerHTML = `<p> <a href="/estate/${estate.slug}"> ${
        estate.title
      }</a>  </br> €${estate.price ? estate.price : "Non specificato"} </p>`;
      customPopUp.style.color = "black";
      customPopUp.style.width = "150px";

      // const popup = new tt.Popup({ offset: popupOffsets, closeOnMove: true }).setDOMContent(customPopUp)
      const popup = new tt.Popup({
        offset: popupOffsets,
        closeOnMove: true,
      }).setDOMContent(customPopUp);

      marker.setPopup(popup);
    });

    setMap(map);
    return () => map.remove();
  }, [sponsoredEstates, unSponsoredEstates]);

  //GSAP ANIMATION
  const wrap = useRef();
  const tl = useRef();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ defaults: { stagger: 0.1 } })
        .fromTo(
          "h1",
          { opacity: 0, ease: "ease.Out" },
          { opacity: 1, ease: "ease.Out" }
        )
        .fromTo(
          "#search",
          { opacity: 0, ease: "ease.Out" },
          { opacity: 1, ease: "ease.Out" }
        )
        .fromTo(
          "input",
          { opacity: 0, ease: "ease.Out" },
          { opacity: 1, ease: "ease.Out" }
        )
        .fromTo(
          ".km",
          {
            opacity: 0,
            ease: "ease.Out",
          },
          { opacity: 1, ease: "ease.Out" }
        )
        .fromTo(
          ".our-btn-header",
          {
            opacity: 0,

            ease: "ease.Out",
          },
          { opacity: 1, ease: "ease.Out" }
        )
        .fromTo(
          "#map",
          { opacity: 0, ease: "ease.Out" },
          { opacity: 1, ease: "ease.Out" }
        )
        .fromTo(
          "#card-cont",
          { opacity: 0, ease: "ease.Out" },
          { opacity: 1, ease: "ease.Out" }
        );
    }, wrap);
  }, []);

  return (
    <>
      <div className={styles.mycontainerfluid} ref={wrap}>
        <h1>Ricerca Avanzata</h1>
        <div className={styles.container}>
          <form id="search" onSubmit={handleSubmit} className={styles.search}>
            <div className={styles.addressSearch}>
              <input type="text" name="address" placeholder="Indirizzo" />
              <div className={styles.miniinputs}>
                <input
                  type="text"
                  name="city"
                  placeholder="Città"
                  defaultValue={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input type="number" name="room_number" placeholder="Stanze" />
                <input type="number" name="bed_number" placeholder="Letti" />
              </div>
              <div className={styles.slidecontainer}>
                <input
                  onChange={(e) => setDistance(e.target.value)}
                  type="range"
                  name="distance"
                  min="0"
                  max="30"
                  defaultValue={distance}
                  className={styles.slider}
                />
                <span className="km">{distance} km</span>
              </div>
            </div>
            <div className={styles.services}>
              {allServices &&
                allServices.map((service, key) => (
                  <div key={key} className={styles.formgroup}>
                    <input
                      onClick={(e) => {
                        if (e.target.checked) {
                          setFilteredServices([
                            ...filteredServices,
                            service.id,
                          ]);
                        } else {
                          setFilteredServices(
                            filteredServices.filter((ser) => ser !== service.id)
                          );
                        }
                      }}
                      type="checkbox"
                      name={service.name}
                      id={service.id}
                    />
                    <label htmlFor={service.id}>{service.name}</label>
                  </div>
                ))}
            </div>
            <button className="our-btn-header" type="submit">
              Search
            </button>
          </form>
        </div>
        <div id="map" className={styles.tommap}></div>
        {sponsoredEstates.length > 0 && <h2>In Evidenza</h2>}
        <div id="card-cont" className={styles.cardscontainer}>
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

        {unSponsoredEstates.length > 0 && <h2>All</h2>}
        <div id="card-cont" className={styles.cardscontainer}>
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
    </>
  );
}
