#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import question from './question/index.js';
import download from './download.js';

const VERSION = `0.0.1`;

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
