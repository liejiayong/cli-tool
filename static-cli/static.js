let __count__ = 0;
const CONFIG = {
    gitType: "direct:",
    gitURL: "https://gitee.com/liejiayong/cli-static-template.git",
    gitBranch: "static",
    templatePath: "__template__",
    baseURL: "./",
    spriteBaseURL: "./",
    css: {
        outputPath: "css/",
        spriteName: "sprite",
        ext: ".css",
    },
    // 单独 与 雪碧图
    images: {
        ext: "jpg,jpeg,png,gif",
        cssUnit: "px",
        inputPath: "images",
        outputPath: `img/`,
        padding: 60,
        quality: [0.7, 0.8],
        compressExt: "jpg,png",
        spriteDir: {
            prefix: "sp",
            suffix: "",
            symbol: "_",
            /* 图片集合分类时，雪碧图文件夹匹配 new RegExp(`\\/${CONFIG.images.inputPath}\\/${CONFIG.images.spriteDir.prefix}${CONFIG.images.spriteDir.symbol}(\\w*)\\/.+$`)
            为空时的预设名称*/
            base: "n" + __count__,
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
    postcss: {
        rootValue: 75,
        unitPrecision: 2,
        propList: [],
        selectorBlackList: [],
        replace: true,
        mediaQuery: false,
        minPixelValue: 0,
        exclude: /node_modules/i,
    },
    __self__: true,
};

export default CONFIG;
