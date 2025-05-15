
import style from "../../../styles/Paginadeespera.module.css"

function PaginaDeEspera() {
  return (
    <div className={style.container}>
     <div className={style.containerInfo}>
     <img className={style.logo} src="../../../../logo.png" alt="logo" />
     <p>Aguarde a ser aprobado por Wifrut</p>
     <p className={style.textInfo}>Recibirás una notificación por correo electrónico una vez que tu aprobación esté completa y puedas comenzar a comprar</p>
     </div>
    </div>
  )
}

export default PaginaDeEspera