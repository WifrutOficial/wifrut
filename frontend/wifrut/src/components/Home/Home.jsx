import { useEffect } from "react";
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
    const oneDay = 24 * 60 * 60 * 1000;
    const now = Date.now();

  
    if (!lastVisit || now - parseInt(lastVisit, 10) > oneDay) {
      Swal.fire({
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; ">
            <h2 style="margin: 0;  font-size: 16px"> 🚚 🕘 ¡HORARIOS Y DÍAS DE ENTREGA!</h2>
            <div style="text-align: center; margin-top: 10px; margin-bottom: 10px;">
              <p style="margin-bottom: 20px;">
                <strong>LUNES A VIERNES:</strong><br />
                NEUQUÉN - CENTENARIO - PLOTTIER
              </p>
              <p style="margin-bottom: 20px;">
                <strong>HORARIOS DE ENTREGA:</strong><br />
                10:30 a 13:30 y de 14:00 a 18:00
              </p>
             <div style="margin-bottom:40px;">
                <strong>PARA MÁS INFORMACIÓN:</strong>
                <p> Consulte el apartado de envíos.</p>
               
              </div>
             <small style="font-weight:bold">"Las imágenes son ilustraciones y no representan la realidad"</small>
          </div>
          </div>
        `,
        confirmButtonText: "¡Entendido!",
        confirmButtonColor: "#247504",
        customClass: {
          popup: style.customAlertInfo,
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
