import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    allowedHosts: ["college-olx.onrender.com"], // Allow Render host
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    allowedHosts: ["college-olx.onrender.com"], // Ensure preview works too
  },
});
