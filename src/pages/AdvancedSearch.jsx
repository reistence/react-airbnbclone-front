import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";
import styles from "../styles/partials/adsearch.module.scss";
import EstateCard from "../components/EstateCard";

export default function AdvancedSearch() {
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/services").then((res) => {
      res.data.results && setAllServices(res.data.results);
    });
  }, []);

  let city, address, rooms, beds;
  const [distance, setDistance] = useState(15);
  const [filteredServices, setFilteredServices] = useState([]);
  let sponsoredEstates = [];
  let unSponsoredEstates = [];

  function handleSubmit(event) {
    event.preventDefault();
    setAllEstates([]);
    // setSponsoredEstates([]);
    // setUnSponsoredEstates([]);
    sponsoredEstates = [];
    unSponsoredEstates = [];

    city = event.target.elements.city.value;
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
      option.params.distance = 20;
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
      console.log("filtrati");
      if (res.data.success) {
        setAllEstates(res.data.results);
        console.log(res.data.results);

        for (let i = 0; i < allEstates.length; i++) {
          const element = allEstates[i];

          if (element.sponsors.length > 0) {
            for (let j = 0; j < element.sponsors.length; j++) {
              const sponsoredElement = element.sponsors[j];

              let parsedElement = Date.parse(sponsoredElement.pivot.end_date);
              if (
                parsedElement > Date.parse(new Date()) &&
                !sponsoredEstates.includes(element)
              ) {
                sponsoredEstates.push(element);
                // setSponsoredEstates([...sponsoredEstates, element]);
              } else if (
                unSponsoredEstates.filter((e) => e.id === element.id)
              ) {
                unSponsoredEstates.push(element);
                // setUnSponsoredEstates([...unSponsoredEstates, element]);
              } else if (sponsoredEstates.filter((e) => e.id === element.id)) {
                // setSponsoredEstates([...sponsoredEstates, element]);
                sponsoredEstates.push(element);
              }
            }
          } else {
            // setUnSponsoredEstates([...unSponsoredEstates, element]);
            unSponsoredEstates.push(element);
          }
        }
      }
      console.log(unSponsoredEstates, "uns");
      console.log(sponsoredEstates, "s");
    });
  }

  const [allEstates, setAllEstates] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/estates").then((res) => {
      setAllEstates(res.data.results);
      // console.log(allEstates);
    });
  }, [allServices]);

  const mapElement = useRef();
  const [map, setMap] = useState({});
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
      customPopUp.innerHTML = `<p> <a href="/estates/${estate.slug}"> ${
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
  }, [allEstates.length]);

  console.log(unSponsoredEstates, "uns");
  console.log(sponsoredEstates, "s");
  return (
    <>
      <div className={styles.mycontainerfluid}>
        <h1>Ricerca Avanzata</h1>
        <div className={styles.container}>
          <form onSubmit={handleSubmit} className={styles.search}>
            <div className={styles.addressSearch}>
              <input type="text" name="address" placeholder="Indirizzo" />
              <div className={styles.miniinputs}>
                <input type="text" name="city" placeholder="Città" />
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
                <span className={styles.km}>{distance} km</span>
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
        <div className="container">
          <h2>In Evidenza</h2>
          <div className={styles.cardscontainer}>
            {sponsoredEstates &&
              sponsoredEstates.map((estate, key) => (
                <EstateCard
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
          <h2>All</h2>
          <div className={styles.cardscontainer}>
            {unSponsoredEstates &&
              unSponsoredEstates.map((estate, key) => (
                <EstateCard
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
