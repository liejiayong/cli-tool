import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import * as utils from "../utils/node.js";
import * as MediaUtils from "./media/util.js";
import * as MediaGen from "./media/gen.js";
import CONFIG from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function initSprite() {}

export default function initImage(program) {
    program
        .command("image")
        .option("-in, --input <string>", "需要处理的文件目录(A directory of files to process)", process.cwd())
        .option("-t, --terminal <string>", "获取图片集信息", "pc")
        .action(async (file, commander) => {
            const url = path.join(process.cwd(), CONFIG.spriteBaseURL, CONFIG.images.inputPath);
            const images = await utils.getAllFile(url);
            const imgMaper = MediaUtils.getImgByDir(images.data);
            console.log("all images: ", file, images, __dirname, imgMaper);

            // 设置运行时变量
            CONFIG["commander"] = file;
            CONFIG["imgMapper"] = imgMaper;

            for (let key in imgMaper) {
                switch (key) {
                    case CONFIG.images.uniName.base:
                        // const uniData = await MediaGen.genUnique(imgMaper[key], key);
                        break;

                    default:
                        console.log("key", key, imgMaper[key]);
                        const spriteData = await MediaGen.genUnique(imgMaper[key], key);
                        break;
                }
            }
        });
}
