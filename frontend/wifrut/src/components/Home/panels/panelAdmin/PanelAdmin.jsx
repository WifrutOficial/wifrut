import React from "react";
import { useNavigate } from "react-router-dom";
import style from "../../../../styles/Admin.module.css";
import { useState } from "react";
import Products from "./Products";
import PanelMayorista from "./PanelMayorista";
import MayoristasAprobados from "./MayoristasAprobados";
import { GoArrowUp } from "react-icons/go";
import BuscarPedidos from "./BuscarPedidos";

function PanelAdmin() {
  const navigate = useNavigate();

  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className={style.container}>
      <p className={style.title}>Panel administrador</p>
      <div className={style.panelContainer}>
        <div className={style.nav}>
          <div className={style.navContent}>
            <img
              className={style.logo}
              src="../../../../../logo.png"
              alt="logo"
            />

            <div className={style.buttons}>
              <button onClick={() => setActiveComponent(<Products></Products>)}>
                Carga de Productos
              </button>
              <button
                onClick={() =>
                  setActiveComponent(<PanelMayorista></PanelMayorista>)
                }
              >
                Solicitudes Pendientes
              </button>
              <button
                onClick={() =>
                  setActiveComponent(
                    <MayoristasAprobados></MayoristasAprobados>
                  )
                }
              >
                Lista Clientes Mayoristas
              </button>
              <button
                onClick={() =>
                  setActiveComponent(<BuscarPedidos></BuscarPedidos>)
                }
              >
                Buscar pedidos
              </button>
            </div>
          </div>
        </div>

        <div>
          {activeComponent || (
            <div className={style.inicialContainer}>
              <p>Selecciona una opción del panel </p>
              <GoArrowUp />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PanelAdmin;
