import path from "path";
import CONFIG from "../config.js";

/**
 * @description: 格式化引擎
 * @return {string} 格式化字符串
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 12:03:51
 */
export const tpl = {
  format: (str = "", data) => {
    return str.replace(/\{#(\w+)#\}/g, function (match, key) {
      return typeof data[key] === undefined ? "" : data[key];
    });
  },
};

/**
 * @description: 单图css模板
 * @return {string} 模板css字符串
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 12:04:25
 */
export const getUniTpl = () => {
  return `
.{#name#} {
    display: inline-block;
    width: {#width#}{#unit#};
    height: {#height#}{#unit#};
    background: url("{#url#}") no-repeat top center / contain;
}
    `;
};

/**
 * @description: 雪碧图公共css模板
 * @return {string} 模板css字符串
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 12:04:25
 */
export const getSpriteComTpl = () => {
  return `
{#cls#} {
    display: inline-block;
    background: url("{#url#}") no-repeat top center / {#width#}{#unit#} auto;
}
    `;
};

/**
 * @description: 雪碧图单图css模板
 * @return {string} 模板css字符串
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 12:04:25
 */
export const getSpriteTpl = () => {
  return `
.{#name#} {
    /* display: inline-block; */
    width: {#width#}{#unit#};
    height: {#height#}{#unit#};
    background-position: {#x#}{#unit#} {#y#}{#unit#};
}
    `;
};

/**
 * @description: 序列化输出图片状态
 * @return {Promise} 序列化图片类型
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-08 15:55:17
 */
export const normalizeImg = (
  coordMap = {},
  sprite = { width: 0, height: 0, spriteDirName: "", spriteNameRaw: "", isSprite: true }
) => {
  const ret = [];
  for (let abPath in coordMap) {
    // const urlReg = new RegExp(`${CONFIG.images.inputPath}(\\/.+)$`);
    // let relPath = abPath.match(urlReg);
    // relPath = relPath[1];
    // relPath = "." + relPath.replace(/\\/, "/");

    // const imageExt = "(" + CONFIG.images.ext.replace(/,/g, "|") + ")";
    // const imageNameReg = new RegExp(`\\/([-_a-zA-Z0-9]+)\\.${imageExt}$`);
    // const imageName = relPath.match(imageNameReg)[1];
    // console.log("urlReg", abPath, urlReg, relPath, imageExt, imageNameReg, imageName);

    let abPathObj = path.parse(abPath);
    // console.log(abPath, abPathObj);

    const imageExt = abPathObj.ext;
    const imageName = abPathObj.name;
    const curCoord = coordMap[abPath];

    const _basePath_ = CONFIG._basePath_,
    _cwd_ = _basePath_.inputDir.replace(/\\{1,2}/g, '/')

    let relPath = abPath.replace(_cwd_,'')
    relPath = relPath.substring(0,1) == '/' ? relPath.slice(1) : relPath
    relPath = `/${CONFIG.images.outputPath}${relPath}`
    relPath = relPath.substring(0,1) == '.' ? relPath : '.'+relPath
    // relPath = path.join(CONFIG.cssReltativeImagePath, relPath)
    if (sprite.isSprite) {
        const relDir = relPath.split(`${sprite.spriteDirName}/`)[0]
        relPath = `${relDir}${sprite.spriteNameRaw}.png`
    }

    const outputPath = path.join(_basePath_.inputDir, relPath)
    const outputDir = path.parse(outputPath).dir
    const url2css = path.relative(CONFIG.css.outputPath, relPath).replace(/\\{1,2}/g, '/')
    // console.log('normalizeImg',abPath, _cwd_, relPath,url2css,outputPath)

    ret.push({
      name: imageName,
      width: curCoord.width,
      height: curCoord.height,
      x: curCoord.x,
      y: curCoord.y,
      spriteWidth: sprite.width,
      spriteHeight: sprite.height,
      spriteName: sprite.spriteName,
      spriteNameRaw: sprite.spriteNameRaw,
      isSprite: sprite.isSprite,
      relativeUrl: relPath,
      url: url2css,
      cwd: _cwd_,
      inputPath: abPath,
      outputPath,
      outputDir,
    });
  }

  return ret;
};

/**
 * @description: 获取所有单图css样式
 * @param {array} sprites 单图坐标详情
 * @return {object} 所有单图css详情
 * @param {string} object.json 所有单图css样式
 * @param {string} object.name 单图css文件名称
 * @param {array} object.sprites 输入源
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 12:06:54
 */
export const getUniCssJSON = (sprites = []) => {
  let json = "";
  // get unique image for css name

  sprites.forEach((v) => {
    let uniTpl = getUniTpl();
    const css = tpl.format(uniTpl, {
      name: v.name,
      width: v.width,
      height: v.height,
      x: v.x,
      y: v.y,
      url: v.url,
      unit: CONFIG.images.cssUnit,
    });

    json += css;
  });

  return { json, name: CONFIG.images.uniName.base, sprites };
};

/**
 * @description: 获取所有雪碧图css样式
 * @param {array} sprites 雪碧图坐标详情
 * @return {object} 所有雪碧图css详情
 * @param {string} object.json 所有雪碧图css样式
 * @param {string} object.name 雪碧图css文件名称
 * @param {array} object.sprites 输入源
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 12:06:54
 */
export const getSpriteCssJSON = (sprites = []) => {
  // get sprites common part for css name
  let json = "";
  const spritesName = sprites.map((v) => `.${v.name}`).join(",");
  let spriteComTpl = getSpriteComTpl();
  const cssCom = tpl.format(spriteComTpl, {
    cls: spritesName,
    url: sprites[0].url,
    width: sprites[0].spriteWidth,
    unit: CONFIG.images.cssUnit,
  });
  json += cssCom;

  // get sprites by each image coordinates
  sprites.forEach((v) => {
    let spriteTpl = getSpriteTpl();
    const css = tpl.format(spriteTpl, {
      name: v.name,
      width: v.width,
      height: v.height,
      x: v.x,
      y: v.y,
      unit: CONFIG.images.cssUnit,
    });

    json += css;
  });

  return { json, name: sprites[0].spriteNameRaw, sprites };
};
