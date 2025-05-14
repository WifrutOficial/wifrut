import { IoIosEye, IoMdEyeOff } from "react-icons/io";
import style from "../../styles/Register.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";
import axios from "axios";

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
  setLoading(true); // 👈 Activa el loading apenas empieza

  let newErrors = {};

  if (
    !registerData.nombre ||
    !registerData.email ||
    !registerData.phone ||
    !registerData.password ||
    !registerData.confirmpassword ||
    !registerData.tipoUsuario
  ) {
    newErrors.general = "Error, todos los campos son obligatorios";
  }

  if (registerData.password !== registerData.confirmpassword) {
    newErrors.password = "Error, las contraseñas deben coincidir";
  }

  if (registerData.password && registerData.password.length < 8) {
    newErrors.password = "La contraseña debe tener al menos 8 caracteres";
  }

  if (registerData.password && !/[A-Z]/.test(registerData.password)) {
    newErrors.password =
      "La contraseña debe contener al menos una letra mayúscula";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setLoading(false); // 👈 Desactiva si hay errores
    return;
  }

  setErrors({});

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/register`,
      registerData,
      { withCredentials: true }
    );
    alert("Formulario enviado correctamente");
    navigate("/login");
  } catch (error) {
    if (error.response) {
      setErrors({ general: error.response.data.message });
    } else {
      console.log(error);
    }
  } finally {
    setLoading(false); // 👈 Siempre desactiva el loading al final
  }
};

  return (
    <>
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
            <input
              type="text"
              placeholder="Nombre y Apellido"
              value={registerData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
            <input
              type="email"
              placeholder="Correo electronico"
              value={registerData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <input
              type="number"
              placeholder="Telefono"
              value={registerData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
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
            <div className={style.passwordContainer}>
              <input
                type={onClick ? "text" : "password"}
                placeholder="Repetir contraseña"
                value={registerData.confirmpassword}
                onChange={(e) =>
                  handleChange("confirmpassword", e.target.value)
                }
              />
              <IoIosEye className={style.btnEye2} />
              <IoMdEyeOff
                className={onClick ? style.openClose : style.btnEye1}
                onClick={() => setOnClick(!onClick)}
              />
            </div>
            {errors.password && (
              <span className={style.errorText}>{errors.password}</span>
            )}

            <select
              className={style.select}
              value={registerData.tipoUsuario}
              onChange={(e) => handleChange("tipoUsuario", e.target.value)}
            >
              <option value="">Seleccionar tipo de usuario</option>
              <option value="mayorista">Mayorista</option>
              <option value="minorista">Minorista</option>
            </select>
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
              {" "}
              <button onClick={() => navigate("/login")}>Iniciar Sesion</button>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
