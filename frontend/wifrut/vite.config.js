import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Directorio de salida para la build
    rollupOptions: {
      input: './index.html' // El punto de entrada de la aplicación
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Si estás desarrollando el backend localmente
    }
  }
});
