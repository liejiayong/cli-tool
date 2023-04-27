import fs from "fs";
import path from "path";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminGifsicle from "imagemin-gifsicle";

import CONFIG from "../config.js";

export async function imageMinify() {
  const quality = CONFIG.images.quality;
  const compressExt = CONFIG.images.compressExt;
  const url = path.join(CONFIG._basePath_.outputImageDir, `*.{${compressExt}}`);
  //   console.log(CONFIG._basePath_, url);
  const files = await imagemin([url], {
    // destination: "./_compress_",
    plugins: [imageminJpegtran({ quality }), imageminPngquant({ quality }), imageminSvgo({}), imageminGifsicle()],
  });

  for (let file of files) {
    console.log(file);
    fs.writeFileSync(file.sourcePath, file.data);
  }
}
