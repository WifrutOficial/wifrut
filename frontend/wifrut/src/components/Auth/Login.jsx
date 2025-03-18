import React, { useState } from "react";
import style from "../../styles/Register.module.css";
import { IoIosEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [onClick, setOnClick] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };
  const formHandle = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!loginData.email || !loginData.password) {
      setErrors({ general: "Error, todos los campos son obligatorios" });
      return;
    }

    try {
      const user = await login(loginData.email, loginData.password);
      console.log("Usuario después del login:", user); // Verifica qué datos trae el usuario

      // Asegurar que `user` tiene las propiedades necesarias
      if (
        !user ||
        !user.tipoUsuario ||
        (user.tipoUsuario === "mayorista" && !user.estadoCuenta)
      ) {
        setErrors({ general: "Error: Datos del usuario incorrectos" });
        return;
      }

      // Redirigir según el tipo de usuario y estadoCuenta
      if (user.tipoUsuario === "admin") {
        navigate("/admin");
      } else if (
        user.tipoUsuario === "mayorista" &&
        user.estadoCuenta === "aprobado"
      ) {
        navigate("/mayorista");
      } else if (
        user.tipoUsuario === "mayorista" &&
        user.estadoCuenta === "pendiente"
      ) {
        navigate("/esperando-aprobacion");
      } else {
        navigate("/minorista");
      }
    } catch (error) {
      console.error("Error completo:", error);

      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({
          general:
            "Usuario o Contraseña incorrectas, por favor intente de nuevo",
        });
      }
    }
  };

  return (
    <div className={style.container}>
      <img className={style.logo} src="../../../logo.png" alt="logo" />
      <div className={style.containerRegister}>
        <p className={style.title}>Iniciar Sesion</p>
        <form className={style.containerForm} onSubmit={formHandle}>
          <input
            type="text"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <div className={style.passwordContainer}>
            <input
              type={onClick ? "text" : "password"}
              placeholder="Contraseña"
              value={loginData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <IoIosEye className={style.btnEye2} />
            <IoMdEyeOff
              className={onClick ? style.openClose : style.btnEye1}
              onClick={() => setOnClick(!onClick)}
            />
          </div>
          <button type="submit" className={style.registerBtn}>
            Iniciar Sesion
          </button>
          {errors.general && (
            <span className={style.errorText}>{errors.general}</span>
          )}
        </form>
        <p className={style.login}>
          ¿No tienes una cuenta?{" "}
          <span>
            <button onClick={() => navigate("/register")}>Registrarme</button>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
