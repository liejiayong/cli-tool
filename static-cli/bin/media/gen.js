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

/**
 * @description: 获取单图集合详情
 * @param {string[]} src 单图集合路径源
 * @param {string} key 单图集合名称
 * @param {object} opts 单图集合配置
 * @return {object} 单图集合详情
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 15:43:56
 */
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

        // console.log("imageStatus", imageStatus);

        // output css coordinates JSON
        const cssMap = mediaTpl.getUniCssJSON(imageStatus);

        return resolve({
          imageDirPath: imgOutputPath,
          imagePath: `${imgOutputPath}${key}.png`,
          imageBuffer: result.image,
          cssDirPath: cssOutputPath,
          cssPath: `${cssOutputPath}${cssMap.name}${CONFIG.css.ext}`,
          cssOutputPath: `${cssOutputPath}${CONFIG.css.spriteName}${CONFIG.css.ext}`,
          cssBuffer: cssMap.json,
          raw: result,
          sprites: imageStatus,
        });
      }
    );
  });
};

/**
 * @description: 获取雪碧图集合详情
 * @param {string[]} src 雪碧图集合路径源
 * @param {string} key 雪碧图集合名称
 * @param {object} opts 雪碧图集合配置
 * @return {object} 雪碧图集合详情
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 15:43:56
 */
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

        // get sprites coordinates
        const imageStatus = mediaTpl.normalizeImg(result.coordinates, {
          ...result.properties,
          spriteName: `${CONFIG.images.spriteDir.prefix}${CONFIG.images.spriteDir.symbol}${key}`,
          spriteNameRaw: key,
          isSprite: true,
        });

        // output css coordinates JSON
        const cssMap = mediaTpl.getSpriteCssJSON(imageStatus);

        return resolve({
          imageDirPath: imgOutputPath,
          imagePath: `${imgOutputPath}${key}.png`,
          imageBuffer: result.image,
          cssDirPath: cssOutputPath,
          cssPath: `${cssOutputPath}${cssMap.name}${CONFIG.css.ext}`,
          cssOutputPath: `${cssOutputPath}${CONFIG.css.spriteName}${CONFIG.css.ext}`,
          cssBuffer: cssMap.json,
          raw: result,
          sprites: imageStatus.sprites,
        });
      }
    );
  });
};

/**
 * @description: 获取输出css文件信息
 * @return {object} { cssDirPath,cssOutputPath }
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 15:46:27
 */
export const getCssPath = () => {
  const cssOutputPath = path.join(CONFIG.commander.input, CONFIG.css.outputPath);
  return {
    cssDirPath: cssOutputPath,
    cssOutputPath: `${cssOutputPath}${CONFIG.css.spriteName}${CONFIG.css.ext}`,
  };
};

/**
 * @description: 获取输出image文件信息
 * @return {object} { cssDirPath,cssOutputPath }
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 15:46:27
 */
export const getImagePath = () => path.join(CONFIG.commander.input, CONFIG.images.outputPath);

export const resetDir = async () => {
  const imgDir = getImagePath();
  const cssDir = getCssPath().cssDirPath;
  await nodeUtils.delDir(imgDir);
  await nodeUtils.delDir(cssDir);
  return Promise.resolve();
};

/**
 * @description: 根据雪碧图集合与单图集合输出文件
 * @param {array} spriteResult 雪碧图集合
 * @param {object} uniResult 单图集合
 * @return {void}
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 15:47:31
 */
export const genCssAndFs = async (spriteResult = [], uniResult = {}) => {
  // concat all sprite css json
  let cssJson = spriteResult.reduce((str, pre) => {
    return str + pre.cssBuffer;
  }, "");

  // concat all unique image css json
  cssJson += uniResult.cssBuffer;

  // output css json
  const cssPath = getCssPath();
  await nodeUtils.mkDir(cssPath.cssDirPath);
  fs.writeFileSync(`${cssPath.cssOutputPath}`, cssJson);
  // output unique images file to dest
  for (let v of uniResult.sprites) {
    const file = v.filePath.slice(CONFIG._basePath_.inputDir.length, v.filePath.length);
    const outputPath = path.join(CONFIG._basePath_.outputImageDir, file);

    // nodeUtils.copyFileByPath(v.filePath, outputPath);
    await nodeUtils.mkDir(path.parse(outputPath).dir);
    fs.copyFileSync(v.filePath, outputPath);
  }

  // output sprite image to dest
  for (let sprite of spriteResult) {
    // !fs.existsSync(sprite.imageDirPath) && fs.mkdirSync(sprite.imageDirPath);
    await nodeUtils.mkDir(sprite.imageDirPath);
    fs.writeFileSync(sprite.imagePath, sprite.imageBuffer);
  }
};
