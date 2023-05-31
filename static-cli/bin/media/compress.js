import utils from "node:util";
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

  if (urls.length) {
    let cur = path.parse(urls[0]);
    await nodeUtil.delDir(`${cur.dir}/.chm/`);
    await nodeUtil.delDir(`${cur.dir}/.temp/`);
    await nodeUtil.mkDir(`${cur.dir}/.chm/`);
    await nodeUtil.mkDir(`${cur.dir}/.temp/`);
  }
  let map = {},
    i = 0,
    miniPaths = [];
  for (let file of urls) {
    i++;
    let cur = path.parse(file),
      chmPath = `${cur.dir}/.chm/${cur.base}`,
      tempPath = `${cur.dir}/.temp/${i}${cur.ext}`;

    await utils.promisify(fs.copyFile)(file, chmPath);
    await utils.promisify(fs.copyFile)(file, tempPath);

    map[tempPath] = {
      rawPath: file,
      chmPath,
      tempPath,
    };
    miniPaths.push(tempPath);

    await Promise.resolve();
  }

  // console.log("compress image path:", urls);
  const files = await imagemin(miniPaths, {
    plugins: [imageminJpegtran({ quality }), imageminPngquant({ quality }), imageminSvgo({}), imageminGifsicle()],
  });
  console.log("compress image file:", JSON.stringify(miniPaths), files);
  for (let file of files) {
    fs.writeFileSync(file.sourcePath, file.data);
  }
}
