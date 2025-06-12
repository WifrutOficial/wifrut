import axios from 'axios';

export const buscarDireccion = async (req, res) => {
  const { direccion } = req.query;

  if (!direccion) {
    return res.status(400).json({ message: 'El parámetro dirección es requerido.' });
  }

  // ✨ CAMBIO 1: Obtenemos la API Key desde las variables de entorno
  // Esto funcionará tanto en Vercel como en tu PC gracias al Paso 2.
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  if (!apiKey) {
    console.error('Error: La API Key de LocationIQ no está configurada en las variables de entorno.');
    return res.status(500).json({ message: 'Error de configuración del servidor.' });
  }

  try {
    const direccionCompleta = `${direccion}, Neuquén, Argentina`;

    // ✨ CAMBIO 2: Construimos la nueva URL para LocationIQ
    // Nótese cómo usamos la variable `apiKey`.
    const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(
      direccionCompleta
    )}&format=json&addressdetails=1&limit=1`;
    
    const response = await axios.get(url);

    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error al contactar el servicio de geolocalización (LocationIQ):', error.message);
    
    // Esto es útil para depurar si LocationIQ da un error específico
    if (error.response) {
      console.error('Respuesta del error de LocationIQ:', error.response.data);
    }
    
    res.status(500).json({ message: 'Error en el servidor al buscar la dirección.' });
  }
};