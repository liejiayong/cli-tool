import fs from "fs";
import prettier from "prettier";
import config from "../../prettier.config.mjs";

export function format(codePath) {
    // return new Promise((resolve, reject) => {
    const code = fs.readFileSync(codePath, "utf8");
    const formatted = prettier.format(code, config);
    fs.writeFileSync(codePath, formatted);
    // });
}
