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
            // console.log("all images: ", file, images, __dirname, imgMaper);

            // 设置运行时变量
            CONFIG["commander"] = file;
            CONFIG["imgMapper"] = imgMaper;

            const genMap = {
                uni: {},
                sprite: [],
            };
            for (let key in imgMaper) {
                switch (key) {
                    case CONFIG.images.uniName.base:
                        console.log(CONFIG.images.uniName.base, key);
                        const uniData = await MediaGen.getImageData(imgMaper[key], key);
                        genMap.uni = uniData;
                        break;

                    default:
                        const spriteData = await MediaGen.getSpriteData(imgMaper[key], key);
                        genMap.sprite = [...genMap.sprite, spriteData];
                        break;
                }
            }

            MediaGen.genCssAndFs(genMap.sprite, genMap.uni);
            // console.log("genMap", genMap);
        });
}
