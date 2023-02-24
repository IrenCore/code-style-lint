// import minimist from "minimist";
import inquirer from "inquirer";
import prettier from "prettier";
import {
  readFileSync,
  existsSync,
  writeFileSync,
  appendFileSync,
} from "fs-extra";
import { lightGreen, red, cyan } from "kolorist";
import path from "node:path";
import { defaultTemplate, prettierConfig } from "./utilts";
import { fileURLToPath } from "node:url";

const __dirname = path.resolve();

interface PromptResult {
  lintType: string;
}

async function main() {
  const metaDataPath = path.resolve(
    fileURLToPath(import.meta.url),
    "../../meta-data.json"
  );

  const metaData = readFileSync(metaDataPath);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const data = JSON.parse(metaData);

  let result: PromptResult;

  try {
    result = await inquirer.prompt([
      {
        type: "list",
        name: "lintType",
        message: "Select Your project lint type?",
        choices: data.packages.map((i: any) => i.packageName),
        loop: false,
      },
    ]);
  } catch (error) {
    console.log(red(error));
    return;
  }

  const { lintType } = result;

  // 往 pkg 添加依赖
  const packagesFilePath = path.join(__dirname, "package.json");
  if (existsSync(packagesFilePath)) {
    const pkg = JSON.parse(readFileSync(packagesFilePath, "utf-8"));
    if (pkg.devDependencies) {
      pkg.devDependencies[`eslint-config-${lintType}`] = `^${
        data.packages.find((i: any) => i.packageName === lintType)
          .packageVersion
      }`;
    } else
      pkg.devDependencies = {
        [`elint-config-${lintType}`]: data.packages.find(
          (i: any) => i.packageName === lintType
        ).packageVersion,
      };

    writeFileSync(
      packagesFilePath,
      prettier.format(JSON.stringify(pkg), {
        ...prettierConfig,
        parser: "json",
      })
    );
  } else {
    throw new Error("package.json is not exist!");
  }

  // 判断是否存在 .eslintrc
  const dir = path.join(__dirname, ".eslintrc");
  if (existsSync(dir)) {
    console.log("Directory exists, Will modify.eslintrc!");

    const eslintrc = readFileSync(dir, "utf-8");
    const parseEslintrc = JSON.parse(eslintrc) as Record<
      string,
      {
        extends: string[];
      }
    >;

    Object.assign(parseEslintrc, {
      extends: Array.from(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new Set([...(parseEslintrc?.extends ?? []), lintType])
      ),
    });
    writeFileSync(
      dir,
      prettier.format(JSON.stringify(parseEslintrc), {
        ...prettierConfig,
        parser: "json",
      }),
      "utf-8"
    );
  } else {
    console.log("Directory not found, Will create.eslintrc.");
    appendFileSync(dir, defaultTemplate(lintType), "utf-8");
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : "npm";

  console.log(
    cyan(`You selected ${result.lintType}, Please the following command!`)
  );
  switch (pkgManager) {
    case "yarn":
      console.log(` ${lightGreen("  yarn")}`);
      break;
    default:
      console.log(` ${lightGreen(`  ${pkgManager} install`)}`);
      break;
  }

  console.log();
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined;

  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");

  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

main().catch((error) => {
  console.error(error);
});
