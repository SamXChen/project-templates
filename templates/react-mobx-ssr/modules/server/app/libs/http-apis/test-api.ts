import { IApiGroup } from 'http-adapter/dist/api';
import { EggAppConfig } from 'egg';

function buildApis(config: EggAppConfig): IApiGroup {

    const apis: IApiGroup = {
        TEST_API: {
            url: `${config.apiHost}/`,
            method: 'GET',
            auth: false,
            jsonBody: false,
        },
    };

    return apis;
}

export default buildApis;
