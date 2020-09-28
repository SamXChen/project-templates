import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  pug: {
    enable: true,
    package: 'egg-view-pug',
  },

  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
};

export default plugin;
