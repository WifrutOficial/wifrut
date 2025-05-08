import React, { useEffect } from "react";
import Swal from "sweetalert2";
import style from "../../styles/Products.module.css";
import ProductsRender from "../Products/ProductsRender";
import Banners from "../Home/Banners";
import AboutUs from "./AboutUs";
import Footer from "./Footer";
import Nav2 from "./Nav2";

function Home() {
  useEffect(() => {
    const key = "visitTimestamp";
    const lastVisit = localStorage.getItem(key);
    const oneDay = 24 * 60 * 60 * 1000; // ms en 24 h
    const now = Date.now();

    if (!lastVisit || now - parseInt(lastVisit, 10) > oneDay) {
      Swal.fire({
        title: "¡Bienvenid@ a Wifrut!",
        text: "completar con info",
        icon: "info",
        iconColor:"#247504",
        confirmButtonText: "¡Entendido!",
        confirmButtonColor: "#247504",
         customClass: {
                  popup: style.customAlert,
                },
      });
      localStorage.setItem(key, now.toString());
    }
  }, []);

  return (
    <div>
      <Nav2 />
      <Banners />
      <ProductsRender />
      <AboutUs />
      <Footer />
    </div>
  );
}

export default Home;
