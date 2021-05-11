const chalk = require('chalk')
const { v4: uuidv4 } = require('uuid')
const { createLogger } = require('../utils/create-logger')

const logger = createLogger()

function apmMid(name) {
    return async (ctx, next) => {
        const currentTransaction = buildTransaction(name)
        currentTransaction.ctx = ctx
    
        const { transaction } = ctx

        if (!transaction) {
            currentTransaction.root = currentTransaction
        } else {
            ctx.transaction.children.push(currentTransaction)
            currentTransaction.parent = ctx.transaction
            currentTransaction.root = ctx.transaction.root
        }

        const preTransaction = transaction
        ctx.transaction = currentTransaction
    
        try {
            currentTransaction.begin()
            await next()
        } catch(err) {
            currentTransaction.error(err)
        } finally {
            currentTransaction.end()
            if (preTransaction) {
                ctx.transaction = preTransaction
            }
        }
    }
}

function buildTransaction(name = '') {

    const trans = {
        ctx: undefined,
        name,
        id: uuidv4().split('-')[0],
        startTs: undefined,
        endTs: undefined,
        begin,
        end,
        error,
        print,
        log,
        children: [],
        parent: null,
        root: null,
    }

    return trans

    function begin() {
        trans.startTs = Date.now()
        logger.info(trans.print(chalk.green(`start`)))
        if (!trans.parent) {
            // root, log request
            logger.info(trans.print(chalk.green(stringifyReq(trans.ctx.req))))
        }
    }

    function end() {
        trans.endTs = Date.now()
        if (!trans.parent) {
            // root, log response
            logger.info(trans.print(chalk.green(stringifyRes(trans.ctx.response))))
        }
        logger.info(trans.print(chalk.green(`end: cost: ${trans.endTs - trans.startTs} ms`)))
    }

    function log(message = '') {
        logger.info(trans.print(chalk.whiteBright(message)))
    }

    function error(err) {
        logger.error(trans.print(chalk.red(err.toString())))
    }

    function print(message = '') {
        if (trans.parent) {
            return `[${chalk.yellow(trans.root.id)}] [${chalk.blue(trans.parent.id)}-${chalk.blueBright(trans.id)}] [${chalk.cyan(trans.name)}]: ${message}`
        }
        return `[${chalk.yellow(trans.root.id)}]: ${message}`
    }
}

function stringifyReq(req) {
    return `
        =>
        url: ${req.url}
        method: ${req.method}
        headers: ${JSON.stringify(req.headers)}
        query: ${JSON.stringify(req.query)}
    `
}

function stringifyRes(res) {
    return `
        <=
        status: ${res.status}
        headers: ${JSON.stringify(res.headers)}
    `
}

module.exports = {
    apmMid,
}
