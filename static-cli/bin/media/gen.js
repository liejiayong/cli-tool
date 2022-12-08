import fs from "fs";
import path from "path";
import Spritesmith from "spritesmith";
import * as nodeUtils from "../../utils/node.js";
import * as mediaTpl from "./template.js";
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

export const getImageData = async (src, key = "", opts = {}) => {
  // console.log("getSpriteData", src.length, key, opts);
  const params = Object.assign(getDefaultParams(), opts);

  const imgOutputPath = path.join(CONFIG.commander.input, CONFIG.images.outputPath);
  const cssOutputPath = path.join(CONFIG.commander.input, CONFIG.css.outputPath);

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

        // get sprites coordinates
        const imageStatus = mediaTpl.normalizeImg(result.coordinates, {
          ...result.properties,
          spriteName: "",
          spriteNameRaw: "",
          isSprite: false,
        });

        console.log("imageStatus", imageStatus);

        // output css coordinates JSON
        const cssMap = mediaTpl.getUniCssJSON(imageStatus);

        return resolve({
          imageDirPath: imgOutputPath,
          imagePath: `${imgOutputPath}${key}.png`,
          imageBuffer: result.image,
          cssDirPath: cssOutputPath,
          cssPath: `${cssOutputPath}${cssMap.name}.${CONFIG.css.ext}`,
          cssOutputPath: `${cssOutputPath}${CONFIG.css.spriteName}.${CONFIG.css.ext}`,
          cssBuffer: cssMap.json,
          raw: result,
          sprites: imageStatus,
        });
      }
    );
  });
};

export const getSpriteData = async (src, key = "", opts = {}) => {
  // console.log("getSpriteData", src.length, key, opts);
  const params = Object.assign(getDefaultParams(), opts);

  const imgOutputPath = path.join(CONFIG.commander.input, CONFIG.images.outputPath);
  const cssOutputPath = path.join(CONFIG.commander.input, CONFIG.css.outputPath);

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

        // // output sprites
        // !fs.existsSync(imgOutputPath) && fs.mkdirSync(imgOutputPath);
        // fs.writeFileSync(imgOutputPath + `${key}.png`, result.image);

        // get sprites coordinates
        const imageStatus = mediaTpl.normalizeImg(result.coordinates, {
          ...result.properties,
          spriteName: `${CONFIG.images.spriteDir.prefix}${CONFIG.images.spriteDir.symbol}${key}`,
          spriteNameRaw: key,
          isSprite: true,
        });

        // output css coordinates JSON
        const cssMap = mediaTpl.getSpriteCssJSON(imageStatus);
        // !fs.existsSync(cssOutputPath) && fs.mkdirSync(cssOutputPath);
        // fs.writeFileSync(`${cssOutputPath}${cssMap.name}.${CONFIG.css.ext}`, cssMap.json);

        return resolve({
          imageDirPath: imgOutputPath,
          imagePath: `${imgOutputPath}${key}.png`,
          imageBuffer: result.image,
          cssDirPath: cssOutputPath,
          cssPath: `${cssOutputPath}${cssMap.name}.${CONFIG.css.ext}`,
          cssOutputPath: `${cssOutputPath}${CONFIG.css.spriteName}.${CONFIG.css.ext}`,
          cssBuffer: cssMap.json,
          raw: result,
          sprites: imageStatus.sprites,
        });
      }
    );
  });
};

export const genCssAndFs = async (spriteResult = [], uniResult = {}) => {
  // await nodeUtils.delDir(imgOutputPath);

  console.log("uniResult", uniResult);
  uniResult.sprites.forEach((v) => {
    nodeUtils.copyFileByPath(v.filePath, v.outputPath);
  });

  // concat all sprite css json
  let cssJson = spriteResult.reduce((str, pre) => {
    // output sprite image
    !fs.existsSync(pre.imageDirPath) && fs.mkdirSync(pre.imageDirPath);
    fs.writeFileSync(pre.imagePath, pre.imageBuffer);

    return str + pre.cssBuffer;
  }, "");

  // concat all unique image css json
  cssJson += uniResult.cssBuffer;

  // output css json
  const tplData = spriteResult[0];
  !fs.existsSync(tplData.cssDirPath) && fs.mkdirSync(tplData.cssDirPath);
  fs.writeFileSync(`${tplData.cssOutputPath}`, cssJson);
};
