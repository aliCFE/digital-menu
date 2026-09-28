import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5195,
    // Binds to the LAN interface too, so a phone on the same Wi-Fi can open
    // this dev server directly (local network only — not internet-facing).
    host: true,
    // Accept the Host header from the Cloudflare Tunnel hostname (approved
    // by the user for sharing a trial link).
    allowedHosts: true,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
