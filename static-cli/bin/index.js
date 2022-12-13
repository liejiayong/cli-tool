#!/usr/bin/env node --experimental-modules

/**
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-11-23 11:46:28
 *
 * node@<=12不支持全局async函数，
 * node@>12支持全局async函数
 */

import path from "path";
import fs from "fs";
import { Command } from "commander";

import initImage from "./image.js";
// import program from './commander.js';
// import question from './question/index.js';
// import download from './download.js';

const program = new Command();

program.version;

initImage(program);

program.parse(process.argv);

// console.log(program.opts());
/*
nodeV12版本需要使用question().then((answer) => {
  console.log(answer);
});
 */
// const answer = await question();
// const dirPath = path.resolve(answer.dirName, answer.packageName);
// answer.dirPath = dirPath;

// if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

// await download(answer);
