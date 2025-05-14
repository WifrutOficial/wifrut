import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  build: {
   outDir: 'D:/wifrut-dist',
  },
  base: './',  
  server: {
    host: true, 
    allowedHosts: ['.ngrok-free.app'],
  },     
});
