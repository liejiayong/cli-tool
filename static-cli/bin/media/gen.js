import fs from "fs";
import path from "path";
import Spritesmith from "spritesmith";
import * as nodeUtils from "../../utils/node.js";
import CONFIG from "../config.js";

const getDefaultParams = () => {
    return { padding: CONFIG.images.padding };
};

class MediaController {
    constructor() {
        this.Spritesmith = Spritesmith;
    }
}

export default MediaController;

export const genUnique = async (src, key = "", opts = {}) => {
    console.log("genUnique", src.length, key, opts);
    const params = Object.assign(getDefaultParams(), opts);

    const outputPath = path.join(CONFIG.commander.input, CONFIG.images.outputPath);
    // await nodeUtils.delDir(outputPath);

    return new Promise((resolve, reject) => {
        Spritesmith.run(
            {
                src,
                ...params,
            },
            function handleResult(err, result) {
                if (err) {
                    return reject(err);
                }

                !fs.existsSync(outputPath) && fs.mkdirSync(outputPath);
                fs.writeFileSync(outputPath + `${key}.png`, result.image);
                console.log(err, "xx", result, outputPath);

                // fs.mkdirSync(OPTIONS.outputDir, { recursive: true });
                // // 保存雪碧图图片
                // fs.writeFileSync(`${OPTIONS.outputDir}${OPTIONS.spriteImageName}`, result.image);

                // // 保存雪碧图JSON文件
                // fs.writeFileSync(`${OPTIONS.outputDir}${OPTIONS.spriteImageJSON}`, JSON.stringify(json, 0, 4));
                // // 保存雪碧图CSS文件
                // fs.writeFileSync(`${OPTIONS.outputDir}${OPTIONS.spriteImageCSS}`, cssLines.join("\n"));
                // console.log("finish");

                return resolve();
            }
        );
    });
};
