import style from "../../../../styles/Admin.module.css";
import { useState } from "react";
import Products from "./Products";
import MayoristasAprobados2 from "./MayoristasAprobados2";
import { GoArrowUp } from "react-icons/go";
import BuscarPedidos from "./BuscarPedidos";
import { useAuth } from "../../../../context/AuthContext";

function PanelAdmin() {
  const [activeComponent, setActiveComponent] = useState(null);
  const { logout } = useAuth();

  return (
    <div className={style.container}>
      {/* Título centrado */}
      <div className={style.header}>
        <p className={style.title}>Panel Administrador</p>
      </div>

      {/* Botón de cerrar sesión a la derecha */}
      <div className={style.logoutWrapper}>
        <button className={style.logoutButton} onClick={logout}>
          <img
            className={style.logoutIcon}
            src="/cerrar-sesion.png"
            alt="cerrar sesión"
          />
          Cerrar Sesión
        </button>
      </div>

      {/* Contenido principal del panel */}
      <div className={style.panelContainer}>
        <div className={style.navContent}>
          <img
            className={style.logo}
            src="../../../../../logo.png"
            alt="logo"
          />

          <div className={style.buttons}>
            <button onClick={() => setActiveComponent(<Products />)}>
              🛒 Carga de Productos
            </button>

            <button onClick={() => setActiveComponent(<MayoristasAprobados2 />)}>
              👥 Lista Clientes Mayoristas
            </button>

            <button onClick={() => setActiveComponent(<BuscarPedidos />)}>
              🔍 Buscar Pedidos
            </button>
          </div>
        </div>

        <div>
          {activeComponent || (
            <div className={style.inicialContainer}>
              <p>Seleccioná una opción del panel</p>
              <GoArrowUp size={24} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PanelAdmin;
