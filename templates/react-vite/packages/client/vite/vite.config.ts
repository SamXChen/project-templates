import path from 'path'
import fs from 'fs-extra'
import { defineConfig } from 'vite'


import { DIR_CONFIG } from 'common-config'

import legacyPlugin from '@vitejs/plugin-legacy'
import reactRefreshPlugin from '@vitejs/plugin-react-refresh'
import foldArtTemplatePlugin from './plugins/plugin-art-template-fold'
import ssrModuleInjectPlugin from './plugins/plugin-ssr-module-inject'

export default defineConfig({

  clearScreen: false,

  root: DIR_CONFIG.CLIENT_DIR,

  plugins: [
    legacyPlugin(),
    reactRefreshPlugin(),
    foldArtTemplatePlugin(DIR_CONFIG.CLIENT_DIR),
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
