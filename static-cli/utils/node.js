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
    const orgin = [];

    async function recursion(basePath) {
        const files = fs.readdirSync(basePath);
        files.forEach((file) => {
            let curPath = path.join(basePath, file);
            curPath = path.normalize(curPath).replace(/(\\)/g, "/");
            const stat = fs.statSync(curPath);
            if (stat.isFile()) {
                orgin.push(curPath);
            } else if (stat.isDirectory()) {
                recursion(curPath);
            }
        });
    }

    recursion(basePath);
    const _basePath = path.normalize(basePath).replace(/(\\)/g, "/");
    const raw = orgin.map((url) => url.replace(new RegExp(_basePath, "g"), ""));

    return { orgin, raw };
}
