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
import Products from "./components/Products/Products";
import PanelAdmin from "./components/Home/panels/PanelAdmin";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/admin" element={<PanelAdmin />} />

        <Route element={<ProtectedRouter allowedRoles={["admin"]} />}></Route>

        <Route element={<ProtectedRouter allowedRoles={["mayorista"]} />}>
          <Route path="/mayorista" element={<Mayorista />} />
        </Route>

        <Route element={<ProtectedRouter allowedRoles={["minorista"]} />}>
          <Route path="/minorista" element={<Minorista />} />
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);
