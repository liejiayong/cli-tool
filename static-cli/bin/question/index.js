import inquirer from 'inquirer';
import packageName from './packageName.js';
import tplName from './tplName.js';
import dirName from './dirName.js';

export default () => {
  return inquirer.prompt([packageName(), tplName(), dirName()]);
};
