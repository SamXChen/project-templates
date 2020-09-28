import fs from 'fs-extra'
import { ARGVS_PATH } from './consts/paths'

process.argv = fs.readJSONSync(ARGVS_PATH)
import('./main')
