import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import { AuthProvider } from "./context/AuthContext";
import Mayorista from "./components/Home/panels/Mayorista";
import Minorista from "./components/Home/panels/Minorista";
import ProtectedRouter from "./components/PrivateRoute";
import Cart from "./components/Cart/Cart";
import Products from "./components/Home/panels/panelAdmin/Products";
import PanelAdmin from "./components/Home/panels/panelAdmin/PanelAdmin";
import EsperandoAprobacion from "./components/Home/panels/EsperandoAprobacion";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import PaginaDeEspera from "./components/Home/panels/PaginaDeEspera";
import DiscountedProducts from "./components/Products/DiscountedProducts";
import Footer from "./components/Home/Footer";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <SearchProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route  path="/footer" element={<Footer></Footer>} ></Route>

            <Route element={<ProtectedRouter allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<PanelAdmin />} />
              <Route path="/productos" element={<Products />} />
            </Route>
          
            {/* Ruta protegida para usuarios pendientes */}
            <Route element={<ProtectedRouter />}>
            <Route
                path="/esperando-aprobacion"
                element={<EsperandoAprobacion />}
              />
              <Route path="/paginadeespera" element={<PaginaDeEspera />} />
            
            </Route>
            <Route element={<ProtectedRouter allowedRoles={["mayorista"]} />}>
              <Route path="/mayorista" element={<Mayorista />} />
            </Route>

            <Route element={<ProtectedRouter allowedRoles={["minorista"]} />}>
              <Route path="/minorista" element={<Minorista />} />
              <Route path="/cart"  element={<Cart  />}></Route>
              <Route path="/discoutedProducts" element={<DiscountedProducts></DiscountedProducts>} ></Route>
            </Route>
          </Routes>
        </Router>
      </SearchProvider>
    </CartProvider>
  </AuthProvider>
);
