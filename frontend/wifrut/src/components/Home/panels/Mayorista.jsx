import React from "react";
import Nav2 from "../../Home/Nav2";
import Banners from "../Banners";
import ProductsRenderMayorista from "../../Products/ProductsRenderMayorista";
import AboutUs from "../AboutUs";
import Footer from "../Footer";

function Mayorista() {
  return (
    <div>
      <Nav2></Nav2>
      <Banners></Banners>
      <p>este es el panel mayorista</p>
      <ProductsRenderMayorista></ProductsRenderMayorista>
      <AboutUs></AboutUs>
      <Footer></Footer>
    </div>
  );
}

export default Mayorista;
