import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import ora from "ora";
import symbols from "log-symbols";
import * as nodeUtils from "../utils/node.js";
import * as MediaUtils from "./media/util.js";
import * as MediaGen from "./media/gen.js";
import * as CompressUtils from "./media/compress.js";
import CONFIG from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function initImage(program) {
    program
        .command("image")
        .option("-in, --input <string>", "需要处理的文件目录(A directory of files to process)", process.cwd())
        .option("-t, --terminal <string>", "获取图片集信息", "pc")
        .option("-c, --clear", "清空文件夹", false)
        .action(async (file, commander) => {
            console.log(symbols.info, chalk.green("创建图片生成模块..."));
            const loading = ora("正在创建...");
            loading.start();
            CONFIG["commander"] = file;

            // reset directory
            MediaGen.resetDir();

            // 开启clear只清空文件
            if (file.clear) {
                return;
            }

            const url = path.join(process.cwd(), CONFIG.spriteBaseURL, CONFIG.images.inputPath);
            const images = await nodeUtils.getAllFile(url);
            const imgMaper = MediaUtils.getImgByDir(images.data);

            // 设置运行时变量
            CONFIG["imgMapper"] = imgMaper;

            // console.log("all images: ", file, images, __dirname, imgMaper);

            const genMap = {
                uni: {},
                sprite: [],
            };
            for (let key in imgMaper) {
                switch (key) {
                    case CONFIG.images.uniName.base:
                        const uniData = await MediaGen.getImageData(imgMaper[key], key);
                        genMap.uni = uniData;
                        break;

                    default:
                        const spriteData = await MediaGen.getSpriteData(imgMaper[key], key);
                        genMap.sprite = [...genMap.sprite, spriteData];
                        break;
                }
            }

            // output sprite files
            await MediaGen.genCssAndFs(genMap.sprite, genMap.uni);

            const loadMinify = ora("正在压缩图片");
            await CompressUtils.imageMinify(MediaGen.getCssPath().cssOutputPath);
            loadMinify.succeed();

            loading.succeed();
            console.log(symbols.success, chalk.green("创建图片雪碧图成功"));
        });
}
