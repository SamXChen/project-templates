import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as path from 'path';
import * as fs from 'fs-extra';

const STATIC_ASSETS_PATH = path.resolve(__dirname, '../../public');
const VIEWS_PATH = path.resolve(__dirname, '../../public/views');

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // 预创建目录
  fs.ensureDirSync(STATIC_ASSETS_PATH);
  fs.ensureDirSync(VIEWS_PATH);

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1550039808849_8894';

  // add your egg config in here
  config.middleware = [];

  // views
  config.view = {
    mapping: {
      '.pug': 'pug',
    },
    root: VIEWS_PATH,
  };

  // static assets
  config.static = {
    prefix: '/test-app/',
    dir: STATIC_ASSETS_PATH,
    dynamic: true,
  };

  // add your special config in here
  const bizConfig = {
    apiHost: 'http://test.github.com',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
