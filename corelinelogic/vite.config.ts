import fs from 'node:fs'
import path from 'node:path'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type Plugin } from 'vite'

const STATIC_ROUTES = ['workbench', 'docs', 'pricing', 'contact', 'privacy', 'terms']

function staticRoutesPlugin(): Plugin {
  return {
    name: 'corelinelogic-static-routes',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')
      const indexFile = path.join(distDir, 'index.html')
      if (!fs.existsSync(indexFile)) {
        return
      }
      for (const route of STATIC_ROUTES) {
        const routeDir = path.join(distDir, route)
        fs.mkdirSync(routeDir, { recursive: true })
        fs.copyFileSync(indexFile, path.join(routeDir, 'index.html'))
      }
      fs.copyFileSync(indexFile, path.join(distDir, '404.html'))
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    staticRoutesPlugin(),
  ],
})
