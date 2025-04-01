import React from "react";
import Nav from "../../Home/Nav";
import Banners from "../Banners";
import ProductsRenderMayorista from "../../Products/ProductsRenderMayorista";
import AboutUs from "../AboutUs";
import Footer from "../Footer";

function Mayorista() {
  return (
    <div>
      <Nav></Nav>
      <Banners></Banners>
      <p>este es el panel mayorista</p>
      <ProductsRenderMayorista></ProductsRenderMayorista>
      <AboutUs></AboutUs>
      <Footer></Footer>
    </div>
  );
}

export default Mayorista;
