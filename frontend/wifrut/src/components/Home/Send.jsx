import React from 'react'
import Nav2 from './Nav2'
import Footer from './Footer'
import style from "../../styles/Send.module.css"
import MapaZonas from './MapaZonas';

function Send() {
  return (
    <div className={style.container}>
      <Nav2></Nav2>
      <div className={style.containerMap}>
      <MapaZonas />
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Send
