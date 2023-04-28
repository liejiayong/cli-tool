import fs from "fs";
import path from "path";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminGifsicle from "imagemin-gifsicle";

import CONFIG from "../config.js";
import * as nodeUtil from "../../utils/node.js";

export async function imageMinify(inputDir = CONFIG._basePath_.outputImageDir) {
  const quality = CONFIG.images.quality;
  const compressExt = CONFIG.images.compressExt.split(",") || [];
  let fileObj = await nodeUtil.getAllFile(inputDir);

  const urls = fileObj.data.filter((file) => {
    let flag = false;
    compressExt.length &&
      compressExt.forEach((ext) => {
        if (~file.lastIndexOf(`.${ext}`)) {
          flag = true;
        }
      });
    return flag;
  });

  const files = await imagemin(urls, {
    plugins: [imageminJpegtran({ quality }), imageminPngquant({ quality }), imageminSvgo({}), imageminGifsicle()],
  });

  for (let file of files) {
    fs.writeFileSync(file.sourcePath, file.data);
  }
}
