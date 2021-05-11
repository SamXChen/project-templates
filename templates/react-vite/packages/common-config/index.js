const path = require('path')

const CdnConfig = {
  // ** add url prefix for assets while building

  // prefix: 'https://react-vite.com/static/',
}

const ServerConfig = {
  // server - port
  SERVICE_PORT: 3002,
}

const DirConfig = {
  // main dir
  ROOT_DIR: path.resolve(__dirname, '..'),

  // client
  CLIENT_DIR: path.resolve(__dirname, '../client'),
  
  CLIENT_SRC_DIR: path.resolve(__dirname, '../client/modules'),
  CLIENT_DIST_DIR: path.resolve(__dirname, '../client/dist'),

  CLIENT_DIST_HTML_DIR: path.resolve(__dirname, '../client/dist/modules'),
  CLIENT_DIST_ASSET_DIR: path.resolve(__dirname, '../client/dist/assets'),
}

const SsrMap = {
  // [page-name]: [entry-name]
  'page-a': 'main.tsx',
}

module.exports = {
  SERVER_CONFIG: ServerConfig,
  DIR_CONFIG: DirConfig,
  SSR_MAP: SsrMap,
  CDN_CONFIG: CdnConfig,
}
