import { Controller } from 'egg';

export default class ApiController extends Controller {

    public async handleApi() {
        const { ctx } = this;

        const reqBody = ctx.request.body;

        const { actionName, params } = (reqBody as any);

        const adapter = this.service.api.getApiAdapter();

        try {
           const res = await adapter.callAPI(actionName, params);
           ctx.response.status = 200;
           ctx.response.body = res;
        } catch (err) {
            this.logger.error(err);
            ctx.response.status = 500;
            if (err.message) {
                ctx.response.body = err.message;
            } else {
                ctx.response.body = 'Internal Error!';
            }
        }
    }
}
