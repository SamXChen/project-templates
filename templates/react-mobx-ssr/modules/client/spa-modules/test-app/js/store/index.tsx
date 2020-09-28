import { observable } from 'mobx'

class store {

    @observable text: string = 'text'

    constructor() {
        this.init()
    }

    public init() {
        try {
            if (__data__.storeData.length !== 0) {
                this.update(__data__.storeData as string)
            }
        } catch (err) {
            //do nothing
        }
    }

    public update(txt = '123') {
        this.text = txt
    }
}

export default new store()