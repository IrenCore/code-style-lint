import { copyFileSync, readdirSync, writeFileSync, readFileSync } from "node:fs";
import { format, resolveConfig, Options } from "prettier";
const dirs = readdirSync("./packages");
dirs.pop();
function getFormatCode(code: string, prettierConfig: Options) {
  if (prettierConfig) {
    return format(code, prettierConfig);
  } else {
    const options = resolveConfig("") || {};
    return format(code, Object.assign(prettierConfig, options));
  }
}
async function run() {
  for (const dir of dirs) {
    copyFileSync("build/add-stylelint.js", "packages/" + dir + "/add-stylelint.js");
    const packageJson = JSON.parse(readFileSync(`packages/${dir}/package.json`, "utf-8"));
    packageJson.bin = { "add-stylelint": "./add-stylelint.js" };
    packageJson.files = ["index.js", "add-stylelint.js"];
    writeFileSync(`packages/${dir}/package.json`, await getFormatCode(JSON.stringify(packageJson), { parser: "json" }));
  }
}

run();
