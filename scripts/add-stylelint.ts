import { isPackageExists } from "local-pkg";
import { execSync } from "child_process";
import { existsSync, writeFileSync } from "node:fs";
import { readFileSync } from "fs";

enum LockFiles {
  "yarn" = "yarn.lock",
  "pnpm" = "pnpm-lock.yaml",
}

const stylelintConfig = {
  vue: `{
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-vue/scss",
    "stylelint-prettier/recommended"
  ],
  "plugins": ["stylelint-order"],
  "rules": {
    "order/order": ["custom-properties", "dollar-variables", "declarations", "rules", "at-rules"],
    "order/properties-alphabetical-order": true
  }
}`,
  other: `{
  "extends": ["stylelint-config-standard-scss", "stylelint-prettier/recommended"],
  "plugins": ["stylelint-order"],
  "rules": {
    "order/order": ["custom-properties", "dollar-variables", "declarations", "rules", "at-rules"],
    "order/properties-alphabetical-order": true
  }
}`,
};

function getPackageManager() {
  if (existsSync(LockFiles.yarn)) {
    return "yarn";
  } else if (existsSync(LockFiles.pnpm)) {
    return "pnpm";
  } else {
    return "npm";
  }
}

function getStyleFileType() {
  if (isPackageExists("sass")) {
    return "scss";
  } else if (isPackageExists("less")) {
    return "less";
  } else {
    return "css";
  }
}
function run() {
  const styleFileType = getStyleFileType();
  const packageManager = getPackageManager();
  if (styleFileType !== "scss") {
    throw new Error("Currently, only SCSS is supported.");
  }
  const workspacesCommand = () => {
    const isWorkspacesMode =
      Boolean(JSON.parse(readFileSync("package.json", "utf-8")).workspaces) || existsSync("pnpm-lock.yaml");
    if (isWorkspacesMode) {
      if (packageManager === "pnpm") {
        return "-w";
      } else if (packageManager === "yarn") {
        return "-W";
      } else {
        return "";
      }
    } else {
      return "";
    }
  };
  const install = packageManager === "npm" ? "install" : "add";
  const isVue = isPackageExists("vue");
  if (!isPackageExists("prettier")) {
    execSync(`${packageManager} ${install} prettier -D ${workspacesCommand()}`);
  }
  execSync(
    `${packageManager} ${install} stylelint stylelint-config-standard-${styleFileType} stylelint-prettier stylelint-order -D ${workspacesCommand()}`,
  );
  if (isVue) {
    execSync(`${packageManager} ${install} stylelint-config-recommended-vue postcss-html -D ${workspacesCommand()}`);
  }
  writeFileSync(".stylelintrc", stylelintConfig[isVue ? "vue" : "other"]);
}

run();
