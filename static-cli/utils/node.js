import fs from "fs";
import url from "url";
import path from "path";
/**
 * Checks whether a path starts with or contains a hidden file or a folder.
 * @param {string} source - The path of the file that needs to be validated.
 * returns {boolean} - `true` if the source is blacklisted and otherwise `false`.
 */
export function isUnixHiddenPath(path) {
  return /(^|\/)\.[^\/\.]/g.test(path);
}

/**
 * @description: ES6模块 获取当前目录路径
 * @return {string} 获取当前目录路径
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-11-23 17:10:48
 */
export function getDirname() {
  return path.dirname(url.fileURLToPath(import.meta.url));
}

/**
 * @description: 获取所有文件路径
 * @param {string} basePath 基础文件夹路径
 * @return {object} 文件列表
 * @return {array} 文件列表
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-11-23 17:11:28
 *
    demo:
    const __dirname = getDirname();
    const curPath = path.join(__dirname, "../images/");
    console.log("test getAllFile", curPath, getAllFile(curPath));
 */
export async function getAllFile(basePath) {
  const data = [];

  async function recursion(basePath) {
    const files = fs.readdirSync(basePath);
    files.forEach((file) => {
      let curPath = path.join(basePath, file);
      curPath = path.normalize(curPath).replace(/(\\)/g, "/");
      const stat = fs.statSync(curPath);
      if (stat.isFile()) {
        data.push(curPath);
      } else if (stat.isDirectory()) {
        recursion(curPath);
      }
    });
  }

  recursion(basePath);

  // // get relative path
  // const _basePath = path.normalize(basePath).replace(/(\\)/g, "/");
  // const raw = data.map((url) => url.replace(new RegExp(_basePath, "g"), ""));

  return { data, basePath };
}

/**
 * @description: 删除文件夹及其下所有文件
 * @param {*} path 当前路径
 * @return {void}
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-07 17:59:19
 */
export async function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }

  return Promise.resolve();
}

export const copyFileByPath = (fromPath = "", toPath = "") => {
  const readStream = fs.createReadStream(fromPath);
  const writeStream = fs.createWriteStream(toPath);
  readStream.pipe(writeStream);
};
export const copyFilesByPath = (files = [], fromPath = "", toPath = "") => {
  fromPaths.forEach((file) => {
    const preFile = `${fromPath}${file}`;
    const nextFile = `${toPath}${file}`;
    const readStream = fs.createReadStream(preFile);
    const writeStream = fs.createWriteStream(nextFile);
    readStream.pipe(writeStream);
  });
};
