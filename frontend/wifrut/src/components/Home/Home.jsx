import Nav from "../Home/Nav";
import ProductsRender from "../Products/ProductsRender";
import Banners from "../Home/Banners"
import AboutUs from "./AboutUs";
import Footer from "./Footer";
import Nav2 from "./Nav2";
//import style from "../../styles/Footer.module.css"

function Home() {
  return (
    <div>
    
      <Nav2></Nav2>
      <Banners></Banners>
      <ProductsRender></ProductsRender>
      <AboutUs></AboutUs>
      <Footer></Footer>
   

    </div>
  );
}

export default Home;
