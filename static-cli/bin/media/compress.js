import fs from "fs";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminGifsicle from "imagemin-gifsicle";

import CONFIG from "../config.js";
import * as pathUtils from "./gen.js";

export async function imageMinify(path) {
    const quality = CONFIG.images.quality;
    const compressExt = CONFIG.images.compressExt;
    const imgPath = pathUtils.getImagePath();
    const files = await imagemin([`${imgPath}/*.{${compressExt}}`], {
        destination: "build/images",
        plugins: [
            imageminJpegtran({ quality }),
            imageminPngquant({
                quality,
            }),
            imageminSvgo({}),
            imageminGifsicle(),
        ],
    });

    for (let file of files) {
        // console.log(file);
        fs.writeFileSync(file.sourcePath, file.data);
    }
}
