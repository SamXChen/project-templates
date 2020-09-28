import request from 'request'
import lodash from 'lodash'
import deepExtend from 'deep-extend'
import { IApi } from '../../../api'
import * as Util from '../../../../utils/http-utils'

const CONNECTION_TIMEOUT = 20 * 1000;

type RequestOption = {
    headers: any;
    uri: string;
    method: 'GET' | 'POST' | 'UPDATE' | 'OPTION' | 'DELETE' | 'PUT';
    json: boolean;
    forever: boolean;
    timeout: number;
    data?: any;
    qs?: any;
    body?: any;
    form?: any;
};

type AppSign = {
    key: string;
    secret: string;
};

// header hook
export type OnHeaderReadyHook = (option: any) => any;

// option hook
export type OnOptionReadyHook = (option: RequestOption) => RequestOption;

// response hook
export type OnResHook = (error: any, response: any, body: any) => { error: any; response: any; body: any };

class HttpService {
    constructor() {
        this.appSign = {
            key: '',
            secret: ''
        }
    }

    /**
   * @description
   * 设置签名用的信息
   * @private
   * @type {AppSign}
   * @memberof HttpService
   */
    private appSign: AppSign

    private baseOptions = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET',
        json: true,
        forever: true,
        timeout: CONNECTION_TIMEOUT
    }

    private onHeaderReady?: OnHeaderReadyHook = undefined

    private onOptionReady?: OnOptionReadyHook = undefined

    private onRes?: OnResHook = undefined

    public setAppSign(appSign: AppSign) {
        this.appSign = appSign
    }

    public setHeaderReadyHook(fn: OnHeaderReadyHook) {
        this.onHeaderReady = fn
    }

    public setOptionReadyHook(fn: OnOptionReadyHook) {
        this.onOptionReady = fn
    }

    public setResReadyHook(fn: OnResHook) {
        this.onRes = fn
    }

    /**
   * 生成签名，输出请求 option
   * @param options
   */
    protected makeSign(options: RequestOption): RequestOption {
        const result = lodash.cloneDeep(options)

        const appSign = this.appSign

        let reqData = {} as {
            [key: string]: any
        }
        let ts = new Date().getTime()
        let requestUri = options.uri

        //删除协议
        requestUri = requestUri.replace(/^http(s)?:\/\/(.*?)\//, '/')
        requestUri = requestUri.split('?')[0]

        const appKey = appSign.key
        const appSecret = appSign.secret

        reqData = options.data || {}

        let dataKeys = lodash.keys(reqData)
        dataKeys = dataKeys.sort()

        let reqDataSorted = {} as any
        lodash.each(dataKeys, (key: string) => {
            reqDataSorted[key] = reqData[key]
        })

        // 过滤 超出长度的参数，不进行签名处理
        lodash.each(dataKeys, (key) => {
            let reqDataVal = reqDataSorted[key]
            if (reqDataVal && reqDataVal.toString) {
                if (encodeURIComponent(reqDataVal.toString()).length > 100) {
                    reqDataSorted[key] = ''
                }
            }
        })

        let paramStr = Util.paramForSignature(reqDataSorted)

        const signStr = [ options.method, ts, requestUri, paramStr ].join(':')

        if (options.headers && appKey && appSecret) {
            result.headers.appKey = appKey
            result.headers.ts = ts
            result.headers.requestUri = requestUri
            result.headers.method = options.method
            result.headers.signature = Util.crypt(signStr, appSecret)
        }

        return result
    }

    protected buildOption(actionName: string, apiDesc: IApi, params?: any): RequestOption {
        let result = deepExtend(lodash.cloneDeep(this.baseOptions), apiDesc.options) as RequestOption

        // uri
        result.uri = apiDesc.url

        // restful url
        if (params) {
            result.uri = Util.parseRestUrl(result.uri, params)
        }

        // method
        result.method = apiDesc.method

        // headers
        if (apiDesc.auth === true) {
            if (params && params.token) {
                result.headers.accessToken = params.token
            }
        }

        // // header hook 回调
        if (this.onHeaderReady) {
            result.headers = this.onHeaderReady(result.headers)
        }

        // 参数处理
        if (lodash.isEmpty(params) === false) {
            const data = params
            result.data = data

            if (apiDesc.method === 'GET' || apiDesc.method === 'DELETE') {
                result.qs = data
            }

            if (apiDesc.method === 'POST' || apiDesc.method === 'PUT') {
                if (apiDesc.jsonBody === true) {
                    result.headers['Content-Type'] = 'application/json'
                    result.form = undefined
                    result.body = data
                }

                if (apiDesc.jsonBody !== true) {
                    result.headers['Content-Type'] = 'application/x-www-form-urlencoded'
                    result.body = undefined
                    result.form = data
                }
            }
        }

        // option hook 回调
        if (this.onOptionReady) {
            result = this.onOptionReady(result)
        }

        // 签名处理
        result = this.makeSign(result)

        return result
    }

    public async request(actionName: string, apiDesc: IApi, params?: any) {
        try {
            const res = await new Promise((resolve, reject) => {
                const options = this.buildOption(actionName, apiDesc, params)
                request(options, (oriError: any, oriResponse: any, oriBody: any) => {
                    let error
                    let response
                    let body
                    if (this.onRes) {
                        const newRes = this.onRes(oriError, oriResponse, oriBody)
                        error = newRes.error
                        response = newRes.response
                        body = newRes.body
                    } else {
                        error = oriError
                        response = oriResponse
                        body = oriBody
                    }

                    let errMsg: any
                    if (error || !response || response.statusCode !== 200) {
                        errMsg = error || body
                        reject(errMsg)
                    }
                    resolve(body)
                })
            })

            return res
        } catch (error) {
            console.error(error)
        }
    }
}

export default HttpService
