import { Application } from 'egg';

import ApiRouter from './routers/api';
import PageRouter from './routers/page';

export default (app: Application) => {

  global.config = app.config;

  const { router } = app;

  const mainRouter = router.namespace('/test-app');

  // api 处理路由
  ApiRouter(app, mainRouter);

  // 页面处理路由
  PageRouter(app, mainRouter);
};
