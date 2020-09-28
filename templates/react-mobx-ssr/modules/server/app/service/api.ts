import { Service } from 'egg';

import buildAdapter from '../libs/http-adapter-builder';

export default class ApiCtrl extends Service {
    public getApiAdapter() {
        return buildAdapter(this.config);
    }
}
