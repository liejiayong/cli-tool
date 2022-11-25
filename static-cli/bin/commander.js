import { Command } from 'commander';
import { VERSIONS } from './var.js';
import {gitInitial} from './git.js'

const program = new Command();

program.version(`static ${VERSIONS}`, '-v, --version')
.description('`static` can create the static page Library')
.option('-t, --template <template>', 'template terminal. the current version is for test', '')
.option('-up, --upgrade', 'upgrade the template from . the current version is for test', '');

program.command('init')
  .description('initial business template')
  .action((str,options) => {
    gitInitial()
  });

program
.command('upload <file>')
.option('-p, --port <number>', 'port number', 80)
.action((file, options) => {
  if (program.opts().progress) console.log('Starting upload...');
  console.log(`Uploading ${file} to port ${options.port}`);
  if (program.opts().progress) console.log('Finished upload');
});

program.parse(process.argv);

const options = program.opts()

// if (options.upgrade) {
//   await gitInitial()
// }

// if (options.template){
//   console.log('template', options)
// }

console.log('process',process.argv, options);

export default program;
