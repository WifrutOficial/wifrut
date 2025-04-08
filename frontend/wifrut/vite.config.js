import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Asegúrate de que la carpeta de salida sea 'dist'
  },
  base: './',  
  server: {
    host: true, // para que Vite escuche en la red
    allowedHosts: ['.ngrok-free.app'], // <-- Esto permite conexiones desde ngrok
  },      // Configura base para rutas relativas cuando se despliegue
});
