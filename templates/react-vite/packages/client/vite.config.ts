import path from 'path'
import fs from 'fs-extra'
import { defineConfig } from 'vite'

import legacy from '@vitejs/plugin-legacy'

import { DIR_CONFIG } from 'common-config'

import foldArtTemplatePlugin from './vite/plugins/plugin-art-template-fold'
import ssrModuleInjectPlugin from './vite/plugins/plugin-ssr-module-inject'
import reactRefreshPlugin from './vite/plugins/plugin-react-refresh'

export default defineConfig({

  clearScreen: false,

  root: DIR_CONFIG.CLIENT_DIR,

  plugins: [
    legacy(),
    reactRefreshPlugin(),
    foldArtTemplatePlugin(),
    ssrModuleInjectPlugin(),
  ],

  build: {
    outDir: DIR_CONFIG.CLIENT_DIST_DIR,
    emptyOutDir: true,
    rollupOptions: {
      input: generateInputs(),
    },
  },
})

function generateInputs() {
  const inputs = {}
  fs.readdirSync(DIR_CONFIG.CLIENT_SRC_DIR).forEach(name => {
    const entryPath = path.join(DIR_CONFIG.CLIENT_SRC_DIR, name, 'index.html')
    if (fs.existsSync(entryPath)) {
      inputs[name] = entryPath
    }
  })
  return inputs
}
