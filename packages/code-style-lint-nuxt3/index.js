module.exports = {
  extends: ["@nuxt/eslint-config", "plugin:prettier/recommended"],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
