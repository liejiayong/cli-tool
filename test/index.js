#!/usr/bin/env node

// const { Command } = require('commander'); /* 可以自动的解析命令和参数，用于处理用户输入的命令 */
// const inquirer = require('inquirer'); /* 命令行交互功能可以在用户执行 init 命令后，向用户提出问题，接收用户的输入并作出相应的处理 */
// const download = require('download-git-repo'); /* 支持从 Github下载仓库 */
// const chalk = require('chalk'); /* 给终端的字体加上颜色 */
// const ora = require('ora'); /* 进度显示 */
// const symbols = require('log-symbols'); /* 在信息前面加上 √ 或 × 等的图标 */
// const handlebars = require('handlebars'); /* 模板引擎，将用户提交的信息动态填充到文件中。 */
// const fs = require('fs');

import commander from 'commander'; /* 可以自动的解析命令和参数，用于处理用户输入的命令 */
import inquirer from 'inquirer'; /* 命令行交互功能可以在用户执行 init 命令后，向用户提出问题，接收用户的输入并作出相应的处理 */
import download from 'download-git-repo'; /* 支持从 Github下载仓库 */
import chalk from 'chalk'; /* 给终端的字体加上颜色 */
import ora from 'ora'; /* 进度显示 */
import symbols from 'log-symbols'; /* 在信息前面加上 √ 或 × 等的图标 */
import handlebars from 'handlebars'; /* 模板引擎，将用户提交的信息动态填充到文件中。 */
import fs from 'fs';

const _VERSION = '1.0.0-dev';

// import('./package.json').then((pkg) => {
//   if (_VERSION !== pkg.version) {
//     pkg.version = _VERSION;
//     fs.writeFileSync('./package.json', pkg, (err) => {
//       if (err) {
//         console.log(chalk.red('version update err'));
//         return;
//       }
//       console.log(chalk.green('version update success'));
//     });
//   }
// });

console.log(symbols.success, chalk.green('Hello, tcli!'));

const program = commander.program;
// const program = new commander.Command();

program.version(`the package version: ${_VERSION}`, '-v, --version');

program.command('init <name>', 'init your <name> for your package').action((name) => {
  console.log('name', name);
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'author',
        message: 'please the author name.',
      },
    ])
    .then((answers) => {
      console.log('answers', answers.author);
      const loading = ora('正在创建...');
      loading.start();
      download('direct:https://gitee.com/liejiayong/jtools.git#master', 'name/src', { clone: true }, (err) => {
        console.log(err ? 'Error' : 'Success');
        if (err) {
          loading.fail();
          console.log(symbols.error, chalk.red(err));
        } else {
          loading.succeed();
          const fileName = `${answers.author}/package.json`;
          const meta = {
            name,
            author: answers.author,
          };
          if (fs.existsSync(fileName)) {
            const content = fs.readFileSync(fileName).toString();
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(fileName, result);
          }
          console.log(symbols.success, chalk.green('创建成功'));
        }
      });
    })
    .catch((err) => {
      console.log(chalk.red('inquirer author err'), err);
    });
});

program.parse(process.argv);
