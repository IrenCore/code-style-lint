#!/usr/bin/env node
import{isPackageExists as r}from"local-pkg";import{execSync as l}from"child_process";import{existsSync as o,writeFileSync as c}from"node:fs";import{readFileSync as p}from"fs";var d=(s=>(s.yarn="yarn.lock",s.pnpm="pnpm-lock.yaml",s))(d||{});const m={vue:`{
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
}`,other:`{
  "extends": ["stylelint-config-standard-scss", "stylelint-prettier/recommended"],
  "plugins": ["stylelint-order"],
  "rules": {
    "order/order": ["custom-properties", "dollar-variables", "declarations", "rules", "at-rules"],
    "order/properties-alphabetical-order": true
  }
}`};function u(){return o("yarn.lock")?"yarn":o("pnpm-lock.yaml")?"pnpm":"npm"}function y(){return r("sass")?"scss":r("less")?"less":"css"}function f(){const i=y(),e=u();if(i!=="scss")throw new Error("Currently, only SCSS is supported.");const t=(()=>!!JSON.parse(p("package.json","utf-8")).workspaces||o("pnpm-lock.yaml")?e==="pnpm"?"-w":e==="yarn"?"-W":"":"")(),n=e==="npm"?"install":"add",a=r("vue");r("prettier")||l(`${e} ${n} prettier -D ${t}`),l(`${e} ${n} stylelint stylelint-config-standard-${i} stylelint-prettier stylelint-order -D ${t}`),a&&l(`${e} ${n} stylelint-config-recommended-vue postcss-html -D ${t}`),c(".stylelintrc",m[a?"vue":"other"])}f();
