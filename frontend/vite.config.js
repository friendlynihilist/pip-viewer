import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/pip-viewer/' : '/',
  server: {
    port: 5173,
    open: true
  },
  publicDir: 'public'
})
