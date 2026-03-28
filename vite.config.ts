import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {visualizer} from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    visualizer({
      filename: 'dist/stats.html',  //Gnerate bundle analysis report at dist/stats.html after each build
      open: true, // automatically open report in browser when build completes
      gzipSize: true, // show gzip-compressed size for each module
      brotliSize: true, // show brotli-compressed size (smaller then gzip)
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api' : {
        target: 'http://localhost:3001',
        rewrite: (path) => path.replace(/^\/api/,'')
      }
    }
  }
})
