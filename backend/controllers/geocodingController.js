// controllers/geocodingController.js
import axios from 'axios';

export const buscarDireccion = async (req, res) => {
  // Obtenemos el parámetro 'direccion' de la URL (query parameter)
  const { direccion } = req.query;

  if (!direccion) {
    return res.status(400).json({ message: 'El parámetro dirección es requerido.' });
  }

  try {
    const direccionCompleta = `${direccion}, Neuquén, Argentina`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      direccionCompleta
    )}&addressdetails=1&limit=1`;

    // Hacemos la petición a la API de OpenStreetMap desde el servidor
    const response = await axios.get(url, {
      headers: {
        // Es buena práctica enviar un User-Agent, como ya lo hacías
        'User-Agent': 'WifrutApp/1.0 (tuemail@example.com)',
      },
    });

    // Enviamos la respuesta de vuelta al frontend
    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error al contactar el servicio de geolocalización:', error.message);
    res.status(500).json({ message: 'Error en el servidor al buscar la dirección.' });
  }
};