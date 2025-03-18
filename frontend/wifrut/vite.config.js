import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Directorio de salida para la build
    rollupOptions: {
      input: 'frontend/index.html', // Aquí es donde debes poner la ruta correcta a tu index.html
    }
  }
});
