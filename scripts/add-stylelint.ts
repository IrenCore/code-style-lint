import { isPackageExists } from "local-pkg";
import { execSync } from "child_process";
import { existsSync } from "node:fs";

enum LockFiles {
  "yarn" = "yarn.lock",
  "pnpm" = "pnpm-lock.yaml",
}

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
  const packageManager = getPackageManager();
  const styleFileType = getStyleFileType();
  if (isPackageExists("vue")) {
    execSync(
      `${packageManager} stylelint stylelint-config-recommended-vue stylelint-config-standard-${styleFileType} stylelint-order stylelint-prettier`,
    );
  }
}
