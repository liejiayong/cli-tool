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
        `\\/${CONFIG.images.inputPath}\\/${CONFIG.images.spriteDir.prefix}${CONFIG.images.spriteDir.symbol}{0,1}(\\w*)\\/.+$`
    );
    // console.log("spReg", spReg);
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
