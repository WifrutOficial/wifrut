import Nav from "../Home/Nav";
import ProductsRender from "../Products/ProductsRender";
import Banners from "../Home/Banners"
import AboutAs from "./AboutAs";

function Home() {
  return (
    <>
    
      <Nav />
      <Banners></Banners>
      <ProductsRender></ProductsRender>
      <AboutAs></AboutAs>

    </>
  );
}

export default Home;
