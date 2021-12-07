import { Command } from 'commander';
import { VERSIONS } from './var.js';

const program = new Command();

program.version(`static ${VERSIONS}`, '-v, --version').description('`static` can create the static page Library');

// program.command('create', 'create a template', { executableFile: 'index.js' }).alias('c');

program.option('-t, --template <template>', 'template terminal. the current version is for test', 'pc');

program.parse(process.argv);

export default program;
