import { CommanderStatic } from 'commander'
import { exec } from 'child_process'

export default function(program: CommanderStatic) {
    program
        .command('pwd')
        .description('show pwd')
        .action(() => {
            exec('pwd', (err, stdout, stderr) => {
                console.log(stdout)
                if (err || stderr) {
                    console.error(err, stderr)
                }
            })
        })
}
