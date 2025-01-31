import React from 'react'
import { useNavigate } from 'react-router-dom'
import style from "../../../styles/Admin.module.css"

function PanelAdmin() {
const   navigate = useNavigate()
  return (
    <div className={style.container}>
      <p>este es el panel del administrador</p>
      <button onClick={() => navigate("/productos")} >navegar a productos</button>
    </div>
  )
}

export default PanelAdmin