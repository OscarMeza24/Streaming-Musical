import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Configuración base para desarrollo
  base: '/',
  
  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    strictPort: true,
    host: '0.0.0.0', // Asegura que escuche en todas las interfaces
    hmr: {
      clientPort: 3000, 
      host: 'localhost',
      port: 3000,
      protocol: 'ws',
    },
    watch: {
      usePolling: true, // Necesario para algunos sistemas de archivos de Docker
    },
  },
  
  // Configuración de resolución de módulos
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // Configuración de construcción básica
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
