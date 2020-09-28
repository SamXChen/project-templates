import '../../utils/fetch-polyfill'
import * as cookie from 'browser-cookies'

class Adapter {
    private urlPrefix = ''

    public setPrefix(prefix: string) {
        this.urlPrefix = prefix
    }

    public async callAPI(actionName: string, params?: object) {
        const timestamp = new Date().getTime()
        const url = `${this.urlPrefix}/apis.json?action=${actionName}&timestamp=${timestamp}`

        const data = {
            actionName: actionName,
            params: params
        }

        const dataStr = JSON.stringify(data)

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dataStr,
            credentials: 'same-origin'
        } as any

        //尝试添加 csrf token，适配 eggjs 策略
        if (cookie.get('csrfToken')) {
            options.headers['x-csrf-token'] = cookie.get('csrfToken')
        }

        try {
            const res = await fetch(url, options)
            if (!res.ok) {
                throw res.status
            }
            const resJson = await res.json()
            return resJson
        } catch (error) {
            throw error
        }
    }
}

export default Adapter
