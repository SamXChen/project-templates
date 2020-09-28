import { Application, Router } from 'egg';

export default (app: Application, router: Router) => {
    const { controller } = app;
    router.post('/apis.json', controller.api.handleApi);
};
