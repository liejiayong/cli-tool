import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import download from "download-git-repo";
import chalk from "chalk";
import ora from "ora";
import symbols from "log-symbols";
import CONFIG from "./config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log("__dirname : " + __dirname, CONFIG);
export const gitInitial = async () => {
    console.log(symbols.info, chalk.green("初始化模板"));
    const loading = ora("初始化中...");
    loading.start();

    return new Promise((resolve, reject) => {
        const url = `${CONFIG.gitType}${CONFIG.gitURL}#${CONFIG.gitBranch}`,
            dest = `${CONFIG.templatePath}`;

        const checkDir = fs.existsSync(dest);
        if (checkDir) {
            loading.succeed();
            console.log(symbols.success, chalk.green("模板初始化成功！"));
        } else {
            download(url, dest, { clone: true }, (err) => {
                if (err) {
                    loading.fail();
                    console.log(symbols.error, chalk.red(err));

                    reject();
                } else {
                    loading.succeed();
                    console.log(symbols.success, chalk.green("模板初始化成功！"));

                    resolve();
                }
            });
        }
    });
};
