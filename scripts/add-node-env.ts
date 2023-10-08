import { writeFileSync, readFileSync } from "node:fs";
const distCode = readFileSync("./build/add-stylelint.js", "utf-8");
writeFileSync("./build/add-stylelint.js", "#!/usr/bin/env node\n" + distCode, "utf-8");
