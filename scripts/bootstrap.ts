import { writeFile, readFileSync } from "fs-extra";
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import prettier, { Config } from "prettier";

export const prettierConfig: Config = {
  printWidth: 100,
  arrowParens: "avoid",
  bracketSpacing: true,
  endOfLine: "lf",
  bracketSameLine: false,
  quoteProps: "as-needed",
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "none",
  useTabs: false,
  vueIndentScriptAndStyle: false,
  overrides: [
    {
      files: "*.md",
      options: {
        embeddedLanguageFormatting: "off",
      },
    },
  ],
};

export const packageRootDir = resolve(__dirname, "..", "packages");

export const packagesFn = readdirSync(packageRootDir)
  .filter((f) => {
    const path = resolve(packageRootDir, f);
    if (!statSync(path).isDirectory()) {
      return false;
    }
    return existsSync(`${path}/index.js`);
  })
  ?.map((f) => {
    const currentFile = JSON.parse(
      readFileSync(resolve(packageRootDir, f, "package.json"), "utf-8")
    );
    const version = currentFile.version;
    return {
      packageName: f,
      packageVersion: version,
    };
  });

async function main() {
  const ignores = [""];
  const exportPackages = packagesFn.filter(
    (c) => !ignores.includes(c.packageName)
  );

  console.log(exportPackages);

  const metaData = `
    {
      packages: [
         ${exportPackages
           .map(
             (item) =>
               `{"packageName": "${item.packageName}","packageVersion": "${item.packageVersion}"}`
           )
           .join(",\n")},
      ],
    }
  `;

  const metaDataPath = resolve(
    packageRootDir,
    "create-code-style-lint/meta-data.json"
  );
  await writeFile(
    metaDataPath,
    prettier.format(metaData, { ...prettierConfig, parser: "json" }),
    "utf-8"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
