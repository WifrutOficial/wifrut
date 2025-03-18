import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'frontend/wifrut/dist', // Asegúrate de que los archivos generados se guarden en el directorio correcto
    rollupOptions: {
      input: './frontend/wifrut/index.html', // El punto de entrada de la aplicación
    }
  },
  server: {
    // En producción no es necesario el proxy
  }
});
