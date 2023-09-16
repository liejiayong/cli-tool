import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import ora from "ora";
import symbols from "log-symbols";
import * as nodeUtils from "../utils/node.js";
import * as MediaUtils from "./media/util.js";
import * as MediaGen from "./media/gen.js";
import * as CompressUtils from "./media/compress.js";

export default function initCompress(program) {
  program
    .command("compress")
    .option("-d, --dir <string>", "输入图片文件夹路径", "")
    .action(async (file, commander) => {
      MediaUtils.initCompressPath(file.dir);

      const loadMinify = ora("正在压缩图片");
      CompressUtils.imageMinify();
      loadMinify.succeed("压缩图片完成");
    });
}
