import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // GitHub Pages (project site) serves the app from
  // https://<username>.github.io/<repo-name>/
  // so the base path must match your repository name exactly.
  // - Deploying to a PROJECT site (e.g. github.com/you/oro-perfume):
  //     base: '/oro-perfume/'   <-- replace with your repo name
  // - Deploying to a USER/ORG site (you.github.io) or a custom domain:
  //     base: '/'
  base: '/oro-perfume/',

  optimizeDeps: {
    include: ['three'],
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
