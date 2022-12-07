console.log("sprite template page");
export const tpl = {
    format: (str = "", data) => {
        return str.replace(/\{#(\w+)#\}/g, function (match, key) {
            return typeof data[key] === undefined ? "" : data[key];
        });
    },
};
export const getSglTpl = () => {
    return `
    .{#name#} {
        display: inline-block;
        width: {#width#};
        height: {#height#};
        background: url("{#url#}{#name#}") no-repeat top center / contain;
    }
    `;
};
export const getSpriteComTpl = (imgName = [], opts = { url: "", name: "", width: "" }) => {
    const cls = imgName.map((v) => `.${v}`).join(",");
    return `
    {#cls#} {
        display: inline-block;
        background: url("{#url#}{#name#}") no-repeat top center / {#width#} auto;
    }
    `;
};
export const getSpriteTpl = () => {
    return `
    .{#name#} {
       // display: inline-block;
        width: {#width#};
        height: {#height#};
        background-size: {#x#} {#y#};
    }
    `;
};
export const formTpl = (isSprite, data) => {
    if (isSprite) {
    }
};
