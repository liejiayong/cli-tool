import CONFIG from "../config.js";

export const getImgByDir = (data = [], flag) => {
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
