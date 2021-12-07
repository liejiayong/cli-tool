#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
// import program from './commander.js';
import question from './question/index.js';
import download from './download.js';

// console.log(program.opts());

/*
nodeV12版本需要使用question().then((answer) => {
  console.log(answer);
});
 */
const answer = await question();
const dirPath = path.resolve(answer.dirName, answer.packageName);
answer.dirPath = dirPath;

if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

await download(answer);
