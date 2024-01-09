#!/usr/bin/env ts-node
// #!/usr/bin/env node

import * as fs from "node:fs";
import * as path from "node:path";

import minimist from "minimist";
import prompts from "prompts";
import { red, green, bold } from "kolorist";

import ejs from "ejs";

import * as banners from "./utils/banners";

async function init() {
  console.log();
  console.log(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8 ? banners.gradientBanner : banners.defaultBanner
  );
  console.log();

  const cwd = process.cwd();
  const argv = minimist(process.argv.slice(2), {
    alias: {
      typescript: ["ts"],
      "with-tests": ["tests"],
      router: ["vue-router"],
    },
    string: ["_"],
    // all arguments are treated as booleans
    boolean: true,
  });
}

init().catch((e) => {
  console.error(e);
});
