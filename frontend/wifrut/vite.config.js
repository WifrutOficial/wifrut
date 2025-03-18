import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // Aquí defines que Vite generará la carpeta "dist"
  }
});
