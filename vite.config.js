import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        detalles: resolve(__dirname, 'detalles.html'),
      }
    }
  }
})
