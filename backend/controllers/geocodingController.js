// Archivo: controllers/geocodingController.js
import axios from 'axios';

export const buscarDireccion = async (req, res) => {
  console.log("--- ¡CONTROLADOR DE GEOCODING EJECUTADO! ---");
  const { direccion } = req.query;

  if (!direccion) {
    return res.status(400).json({ message: 'El parámetro dirección es requerido.' });
  }

  // Obtenemos la API Key desde las variables de entorno de Vercel.
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  if (!apiKey) {
    console.error('Error: La API Key de LocationIQ no está configurada en las variables de entorno.');
    return res.status(500).json({ message: 'Error de configuración del servidor.' });
  }

  try {
    const direccionCompleta = `${direccion}, Neuquén, Argentina`;

    // ===== LA CORRECCIÓN ESTÁ AQUÍ =====
    // En lugar de construir la URL a mano, le pasamos los parámetros a axios
    // en un objeto `params`. Es más seguro y evita errores de formato.
    const response = await axios.get('https://us1.locationiq.com/v1/search.php', {
      params: {
        key: apiKey,            // Axios se encarga de añadirlo a la URL.
        q: direccionCompleta,   // Axios se encarga de codificarlo correctamente.
        format: 'json',
        addressdetails: '1',
        limit: '1'
      }
    });

    // Si la respuesta de LocationIQ no tiene datos, lo consideramos un error.
    if (!response.data || response.data.length === 0) {
      console.log('LocationIQ respondió pero no encontró la dirección:', direccionCompleta);
      return res.status(404).json({ message: 'No se pudo encontrar la dirección ingresada.' });
    }

    // Enviamos la respuesta exitosa al frontend.
    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error al contactar el servicio de geolocalización (LocationIQ):', error.message);
    
    // Esto es útil para depurar si LocationIQ da un error específico (como 'Invalid Key').
    if (error.response) {
      console.error('Respuesta del error de LocationIQ:', error.response.status, error.response.data);
    }
    
    res.status(500).json({ message: 'Error en el servidor al buscar la dirección.' });
  }
};