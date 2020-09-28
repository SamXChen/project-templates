#!/usr/bin/env node
import program from 'commander'
import path from 'path'
import fs from 'fs-extra'

import { ARGVS_PATH } from './consts/paths'

async function main() {
    const handlersDir = path.resolve(__dirname, 'handlers')
    const handlers = fs.readdirSync(handlersDir)
    
    handlers.forEach(handlerPath => {
        const handler = require(path.resolve(handlersDir, handlerPath)).default
        handler(program)
    })
 
    saveArgvs()

    program.version(process.version)
    await program.parseAsync(process.argv)
}

async function saveArgvs() {
    try {
        const file = ARGVS_PATH
        await fs.ensureFile(file)
        await fs.writeJSON(file, process.argv)
    } catch (err) {
        console.warn(err)
    }
}

main()
