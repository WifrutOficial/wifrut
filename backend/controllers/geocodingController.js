
import axios from 'axios';

export const buscarDireccion = async (req, res) => {
  console.log("--- ¡CONTROLADOR DE GEOCODING EJECUTADO! ---");
  const { direccion } = req.query;

  if (!direccion) {
    return res.status(400).json({ message: 'El parámetro dirección es requerido.' });
  }

  const apiKey = process.env.LOCATIONIQ_API_KEY;




  if (!apiKey) {
    console.error('Error: La API Key de LocationIQ no está configurada en las variables de entorno.');
    return res.status(500).json({ message: 'Error de configuración del servidor.' });
  }

  try {

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