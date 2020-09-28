import * as lodash from 'lodash';
import { IApiGroup } from 'http-adapter/dist/api';
import { EggAppConfig } from 'egg';

import testApis from './test-api';

/**
 * 启动时，检查是否有api定义名称出现重复，复杂度O(n^2)
 */
function checkDuplicateKeys(apisArr) {
    const keys = {};
    lodash.forEach(apisArr, apiObj => {
        const apiKeys = lodash.keys(apiObj);
        lodash.forEach(apiKeys, key => {
            if (keys[key] !== undefined) {
                throw new Error('API Key is duplicated: ' + key);
            } else {
                keys[key] = 1;
            }
        });
    });
}

export default function buildApis(config: EggAppConfig): IApiGroup {
    const apiArr = [
        testApis(config),
    ];

    const apis = lodash.extend.apply(lodash, lodash.cloneDeep(apiArr as any));

    // 进行重复命名检查
    checkDuplicateKeys(apiArr);

    // 锁住对象，防止运行时修改配置
    Object.preventExtensions(apis);

    return apis as IApiGroup;
}
