import path from "path";
import CONFIG from "../config.js";

/**
 * @description: 将图片数据按文件夹、单图、不同种类雪碧图分类，并返回
 * @param {array} data 图片路径源
 * @return {object} 分类图片路径源
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 12:12:00
 */
export const getImgByDir = (data = []) => {
  const spReg = new RegExp(
    `\\/${CONFIG.images.spriteDir.prefix}${CONFIG.images.spriteDir.symbol}(\\w*)(${CONFIG.images.spriteDir.symbol}${CONFIG.images.spriteDir.suffix}){0,1}\\/.+$`
  );
//   console.log("spReg", spReg, data);
  const ret = data.reduce(
    (m, pre) => {
      const spFlag = pre.match(spReg);
      if (spFlag) {
        const spName = spFlag[1] || CONFIG.images.spriteDir.base;

        !m[spName] && (m[spName] = []);
        m[spName].push(pre);

        return m;
      }

      m[CONFIG.images.spriteDir.uniqueName].push(pre);

      return m;
    },
    { [CONFIG.images.spriteDir.uniqueName]: [] }
  );

  return ret;
};

/**
 * 初始化CONFIG文件参数
 * @param {string} inputPath
 */
export const initBaseParams = (input) => {
  const cwd = process.cwd();
  const inputPath = path.join(input.input, '/')
  const isAbsolute = path.isAbsolute(inputPath);
  const inputDir = isAbsolute
    ? inputPath
    : inputPath.length
    ? path.join(cwd, inputPath)
    : path.join(cwd, CONFIG.spriteBaseURL, CONFIG.images.inputPath);
  const outputCssDir = path.join(isAbsolute ? inputDir : cwd, CONFIG.css.outputPath);
  const outputImageDir = path.join(isAbsolute ? inputDir : cwd, CONFIG.images.outputPath);

  const INITIAL = { cwd, inputDir, outputCssDir, outputImageDir, isAbsolute };
//   console.log(INITIAL)
  CONFIG["_basePath_"] = INITIAL;
};

export const initCompressPath = (inputPath) => {
  const cwd = process.cwd();
  const isAbsolute = path.isAbsolute(inputPath);
  const inputDir = isAbsolute
    ? inputPath
    : inputPath.length
    ? path.join(cwd, inputPath)
    : path.join(cwd, CONFIG.spriteBaseURL, CONFIG.images.inputPath);
  const outputCssDir = isAbsolute ? inputDir : path.join(cwd, CONFIG.css.outputPath);
  const outputImageDir = isAbsolute ? inputDir : path.join(cwd, CONFIG.images.outputPath);

  const INITIAL = { cwd, inputDir, outputCssDir, outputImageDir };
  CONFIG["_basePath_"] = INITIAL;
};
