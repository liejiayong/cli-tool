#!/usr/bin/env node --experimental-modules
import fs from "fs";
import path from "path";
import url from "url";
import normalize from "normalize-path";
import deepExtend from "../utils/deep-extend.js";
import * as nodeUtils from "../utils/node.js";
import RAW from "../static.js";

let CONFIG = RAW;

const cwdPath = path.join(process.cwd(), "./static.js");
if (fs.existsSync(cwdPath)) {
    let abPath = normalize(cwdPath);
    abPath = nodeUtils.isWindow() ? `file:///${abPath}` : abPath;
    let json = "";

    try {
        // node modules
        json = require(abPath);
    } catch (error) {
        // es modules
        json = await import(abPath).then((module) => module.default);
    }

    // console.log("cwdPath", cwdPath, abPath, json);
    !json.__self__ && deepExtend(CONFIG, json);
}

// console.log("CONFIG data", CONFIG);

export default CONFIG;
