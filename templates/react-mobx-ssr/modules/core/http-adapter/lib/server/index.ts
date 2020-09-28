import { IApiGroup } from '../api';

import HttpService, { OnHeaderReadyHook, OnOptionReadyHook, OnResHook } from './services/http';

class Adapter {

    constructor(){
        this.httpService = new HttpService();
    }

    private httpService: HttpService;

    private apis: IApiGroup = {};

    public setApis(apis: IApiGroup){
        this.apis = apis;
    }

    public setHeaderHook(fn: OnHeaderReadyHook){
        this.httpService.setHeaderReadyHook(fn);
    }

    public setOptionHook(fn: OnOptionReadyHook){
        this.httpService.setOptionReadyHook(fn);
    }

    public setResHook(fn: OnResHook){
        this.httpService.setResReadyHook(fn);
    }

    public async callAPI(actionName: string, params: object){

        const apiDesc = this.apis[actionName];

        try{
            if(apiDesc === undefined){
                throw new Error(`API "${actionName}" is not found`);
            }
            const resp = await this.httpService.request(actionName, apiDesc, params);
            return resp;
        }catch(error){
            throw error;
        }
    }
}

export default Adapter;
export {
    OnHeaderReadyHook,
    OnOptionReadyHook,
    OnResHook
};
