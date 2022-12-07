let __count__ = 0;
const CONFIG = {
    gitType: "direct:",
    gitURL: "https://gitee.com/liejiayong/cli-static-template.git",
    gitBranch: "static",
    templatePath: "__template__",
    baseURL: "./",
    spriteBaseURL: "./",
    // 单独 与 雪碧图
    images: {
        inputPath: "images",
        outputPath: `img/`,
        padding: 60,
        spriteDir: {
            prefix: "sp",
            suffix: "",
            symbol: "_",
            base: "n" + __count__ /* 图片集合分类时，雪碧图文件夹匹配 new RegExp(
                                    `\\/${CONFIG.images.inputPath}\\/${CONFIG.images.spriteDir.prefix}${CONFIG.images.spriteDir.symbol}(\\w*)\\/.+$`
                                ) 为空时的预设名称*/,
            uniqueName: "uni" /* 单独图片名称 */,
        },
        uniName: {
            prefix: "ico",
            base: "uni",
            suffix: "",
            symbol: "_",
        },
        spriteName: {
            prefix: "ico",
            base: "sp",
            suffix: "",
            symbol: "_",
        },
    },
};

export default CONFIG;
