import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  base: "./",
  server: {
    host: true,
    allowedHosts: [
      "wifrut-client.cap.wifrut.com",
      "wifrut.com",
      "www.wifrut.com",
    ],
  },
  preview: {
    host: true,
    allowedHosts: [
      "wifrut-client.cap.wifrut.com",
      "wifrut.com",
      "www.wifrut.com",
    ],
  },
});
