import CONFIG from "../config.js";

export const tpl = {
    format: (str = "", data) => {
        return str.replace(/\{#(\w+)#\}/g, function (match, key) {
            return typeof data[key] === undefined ? "" : data[key];
        });
    },
};
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
export const getSpriteComTpl = () => {
    return `
    {#cls#} {
        display: inline-block;
        background: url("{#url#}") no-repeat top center / {#width#}{#unit#} auto;
    }
    `;
};
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
export const formTpl = (isSprite, data) => {
    if (isSprite) {
    }
};

/**
 * @description: 序列化输出图片状态
 * @return {*}
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-08 15:55:17
 */
export const normalizeImg = (
    coordMap = {},
    sprite = { width: 0, height: 0, spriteName: "", spriteNameRaw: "", isSprite: true }
) => {
    const ret = [];
    for (let abPath in coordMap) {
        const urlReg = new RegExp(`${CONFIG.images.inputPath}(\\/.+)$`);
        let relPath = abPath.match(urlReg);
        relPath = relPath[1];
        relPath = "." + relPath.replace(/\\/, "/");

        const imageExt = "(" + CONFIG.images.ext.replace(/,/g, "|") + ")";
        const imageNameReg = new RegExp(`\\/([-_a-zA-Z0-9]+)\\.${imageExt}$`);
        const imageName = relPath.match(imageNameReg)[1];
        console.log("urlReg", abPath, urlReg, relPath, imageExt, imageNameReg, imageName);
        const curVal = coordMap[abPath];
        ret.push({
            name: imageName,
            width: curVal.width,
            height: curVal.height,
            x: curVal.x,
            y: curVal.y,
            spriteWidth: sprite.width,
            spriteHeight: sprite.height,
            spriteName: sprite.spriteName,
            spriteNameRaw: sprite.spriteNameRaw,
            isSprite: sprite.isSprite,
            spriteUrl: `./${CONFIG.images.outputPath}${sprite.spriteNameRaw}.png`,
            url: relPath,
            filePath: abPath,
        });
    }

    return ret;
};

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

export const getSpriteCssJSON = (sprites = []) => {
    // get sprites common part for css name
    let json = "";
    const spritesName = sprites.map((v) => `.${v.name}`).join(",");
    let spriteComTpl = getSpriteComTpl();
    const cssCom = tpl.format(spriteComTpl, {
        cls: spritesName,
        url: sprites[0].spriteUrl,
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
