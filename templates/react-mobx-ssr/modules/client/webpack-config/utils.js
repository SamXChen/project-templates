const path = require('path')
const fs = require('fs')

/**
 * 获取打包入口
 * @param {string} SPAModulesPath 模块目录绝对路径
 * @param {object?} entriesSpec 指定只打包的某此入口文件名
 * @param {string?} entryExt 入口文件的文件后缀
 * @return {object} {"entry1": { "path": string }, ...}
 */
function getEntries(SPAModulesPath, entriesSpec = [], entryExt = 'tsx') {
    //判断是一个目录还是一个对象
    const files = {}
    const dirs = fs.readdirSync(SPAModulesPath)

    const customEntryKey = entriesSpec
    const hasCustomEntry = customEntryKey.length > 0

    const stack = () => {
        dirs.forEach((item) => {
            if (item === 'commons' || item === '.DS_Store') {
                return
            }
            const fileName = `index.${entryExt}`
            if (hasCustomEntry) {
                if (customEntryKey.includes(item)) {
                    files[item] = {
                        path: path.resolve(SPAModulesPath, item, fileName)
                    }
                    if (entriesSpec[item]) {
                        files[item] = {
                            ...files[item],
                            ...entriesSpec[item]
                        }
                    }
                    testFileExist(files[item].path, entryExt)
                } else {
                    // do nothing
                }
            } else {
                files[item] = {
                    path: path.resolve(SPAModulesPath, item, fileName)
                }
                testFileExist(files[item].path, entryExt)
            }
        })
    }
    stack()

    return files
}

/**
 * 查看文件是否存在
 * @param {string} absFilePath 文件路径
 * @param {string} entryExt 文件后缀
 */
function testFileExist(absFilePath, entryExt) {
    try {
        fs.statSync(absFilePath)
    } catch (err) {
        throw `\nno such file or directory, you have to name the entry file as "index.tsx", then try again.\n\n没有找到合法的入口文件哦，确定入口文件命名为 index.${entryExt}？或者看看是不是 costom-entry.js 的 key 写错了？\n`
    }
}

module.exports = {
    getEntries
}
