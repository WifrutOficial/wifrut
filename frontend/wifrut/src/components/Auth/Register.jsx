import { IoIosEye, IoMdEyeOff } from "react-icons/io";
import style from "../../styles/Register.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [onClick, setOnClick] = useState(false);
  const [loading, setLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    nombre: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
    tipoUsuario: "",
  });

  const handleChange = (name, value) => {
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const formHandle = async (e) => {
    e.preventDefault();
    setLoading(true);

    let newErrors = {};

 
    if (
      !registerData.nombre ||
      !registerData.email ||
      !registerData.phone ||
      !registerData.password ||
      !registerData.confirmpassword ||
      !registerData.tipoUsuario
    ) {
      newErrors.general = "Todos los campos son obligatorios";
    }

    if (registerData.password !== registerData.confirmpassword) {
      newErrors.confirmpassword = "Las contraseñas deben coincidir";
    }

    if (registerData.password && registerData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (registerData.password && !/[A-Z]/.test(registerData.password)) {
      newErrors.password = "La contraseña debe contener al menos una letra mayúscula";
    }

    if (registerData.password && !/[!@#$%^&*]/.test(registerData.password)) {
      newErrors.password = "La contraseña debe contener al menos un símbolo (!@#$%^&*)";
    }

    if (registerData.password && !/\d/.test(registerData.password)) {
      newErrors.password = "La contraseña debe contener al menos un número";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        registerData,
        { withCredentials: true, timeout: 60000 }
      );

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Formulario enviado correctamente",
        confirmButtonColor: "#005234",
        customClass: {
          popup: style.customAlert,
          icon: style.customIconSuc,
        },
      });
      navigate("/login");
    } catch (err) {
      setLoading(false);
      console.error("Error completo:", err);
      console.error("Respuesta del backend:", JSON.stringify(err.response?.data, null, 2));

      if (err.response?.data) {
        const { errors, message, msg } = err.response.data;
        if (errors && typeof errors === "object" && Object.keys(errors).length > 0) {
          setErrors(errors);
        } else if (message) {
          setErrors({ general: message });
        } else if (msg) {
          setErrors({ general: msg });
        } else {
          setErrors({ general: "Error del servidor" });
        }
      } else if (err.code === "ERR_NETWORK") {
        setErrors({
          general: "No hay conexión. Inténtalo de nuevo más tarde.",
        });
      } else {
        setErrors({ general: "Error inesperado, inténtalo de nuevo." });
      }
    }
  };

  return (
    <div className={style.container}>
      <img
        onClick={() => navigate("/")}
        className={style.logo}
        src="../../../logo.png"
        alt="logo"
      />
      <div className={style.containerRegister}>
        <p className={style.title}>Crear Cuenta</p>
        <IoIosArrowDropleft
          className={style.arrow}
          onClick={() => navigate("/")}
        />
        <form className={style.containerForm} onSubmit={formHandle}>
          <div className={style.inputGroup}>
            <input
              type="text"
              placeholder="Nombre y Apellido"
              value={registerData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
            {errors.nombre && (
              <span className={style.errorText}>{errors.nombre}</span>
            )}
          </div>
          <div className={style.inputGroup}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={registerData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <span className={style.errorText}>{errors.email}</span>
            )}
          </div>
          <div className={style.inputGroup}>
            <input
              type="text"
              placeholder="Teléfono"
              value={registerData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <span className={style.errorText}>{errors.phone}</span>
            )}
          </div>
          <div className={style.inputGroup}>
            <div className={style.passwordContainer}>
              <input
                type={onClick ? "text" : "password"}
                placeholder="Contraseña"
                value={registerData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <IoIosEye className={style.btnEye1} />
              <IoMdEyeOff
                className={onClick ? style.openClose : style.btnEye1}
                onClick={() => setOnClick(!onClick)}
              />
            </div>
            {errors.password && (
              <span className={style.errorText}>{errors.password}</span>
            )}
          </div>
          <div className={style.inputGroup}>
            <div className={style.passwordContainer}>
              <input
                type={onClick ? "text" : "password"}
                placeholder="Repetir contraseña"
                value={registerData.confirmpassword}
                onChange={(e) => handleChange("confirmpassword", e.target.value)}
              />
              <IoIosEye className={style.btnEye2} />
              <IoMdEyeOff
                className={onClick ? style.openClose : style.btnEye1}
                onClick={() => setOnClick(!onClick)}
              />
            </div>
            {errors.confirmpassword && (
              <span className={style.errorText}>{errors.confirmpassword}</span>
            )}
          </div>
          <div className={style.inputGroup}>
            <select
              className={style.select}
              value={registerData.tipoUsuario}
              onChange={(e) => handleChange("tipoUsuario", e.target.value)}
            >
              <option value="">Seleccionar tipo de usuario</option>
              <option value="mayorista">Mayorista</option>
              <option value="minorista">Minorista</option>
            </select>
            {errors.tipoUsuario && (
              <span className={style.errorText}>{errors.tipoUsuario}</span>
            )}
          </div>
          <button
            type="submit"
            className={style.registerBtn}
            disabled={loading}
          >
            {loading ? <div className={style.spinner}></div> : "Registrarse"}
          </button>
          {errors.general && (
            <span className={style.errorText}>{errors.general}</span>
          )}
        </form>
        <p className={style.login}>
          ¿Ya tienes una cuenta?{" "}
          <span>
            <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;