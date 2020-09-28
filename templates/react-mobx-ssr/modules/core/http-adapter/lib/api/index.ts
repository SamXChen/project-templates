export interface IApi {
    url: string,
    method: 'GET' | 'POST' | 'OPTION' | 'UPDATE' | 'DELETE' | 'PUT',
    jsonBody: boolean,
    // 是否需要授权
    auth?: boolean,
    options?: object,
}

export interface IApiGroup {
    [actionName: string] : IApi,
}