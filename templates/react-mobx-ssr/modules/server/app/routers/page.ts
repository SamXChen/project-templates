import { Application, Router } from 'egg';

export default (app: Application, router: Router) => {
    const { controller } = app;
    router.get('/test-app', controller.home.main);
};
