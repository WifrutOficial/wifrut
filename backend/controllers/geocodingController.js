// Archivo: controllers/geocodingController.js
import axios from 'axios';

export const buscarDireccion = async (req, res) => {
  console.log("--- ¡CONTROLADOR DE GEOCODING EJECUTADO! ---");
  const { direccion } = req.query;

  if (!direccion) {
    return res.status(400).json({ message: 'El parámetro dirección es requerido.' });
  }

  const apiKey = process.env.LOCATIONIQ_API_KEY;

  // ===== BLOQUE DE DIAGNÓSTICO TEMPORAL =====
  console.log("--- INICIO DE DIAGNÓSTICO DE API KEY ---");
  if (apiKey) {
    console.log("La variable de entorno LOCATIONIQ_API_KEY SÍ existe.");
    console.log(`Longitud de la clave: ${apiKey.length}`);
    console.log(`Primeros 5 caracteres: ${apiKey.substring(0, 5)}`);
    console.log(`Últimos 5 caracteres: ${apiKey.slice(-5)}`);
  } else {
    console.log("¡ERROR CRÍTICO! La variable de entorno LOCATIONIQ_API_KEY NO se encontró o es nula.");
  }
  console.log("--- FIN DE DIAGNÓSTICO ---");
  // ==========================================

  if (!apiKey) { // Dejamos la validación original por si acaso
    console.error('Error: La API Key de LocationIQ no está configurada en las variables de entorno.');
    return res.status(500).json({ message: 'Error de configuración del servidor.' });
  }

  try {
    // El resto del código sigue igual...
    const direccionCompleta = `${direccion}, Neuquén, Argentina`;

    const response = await axios.get('https://us1.locationiq.com/v1/search.php', {
      params: {
        key: apiKey,
        q: direccionCompleta,
        format: 'json',
        addressdetails: '1',
        limit: '1'
      }
    });

    if (!response.data || response.data.length === 0) {
      console.log('LocationIQ respondió pero no encontró la dirección:', direccionCompleta);
      return res.status(404).json({ message: 'No se pudo encontrar la dirección ingresada.' });
    }

    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error al contactar el servicio de geolocalización (LocationIQ):', error.message);
    
    if (error.response) {
      console.error('Respuesta del error de LocationIQ:', error.response.status, error.response.data);
    }
    
    res.status(500).json({ message: 'Error en el servidor al buscar la dirección.' });
  }
};