import { Config } from "prettier";

export const defaultTemplate = (lintType: string) => `{
  "extends": ["${lintType}"]
}`;

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
