#!/usr/bin/env node

import path from "path";
import url from "url";

var __metaDirname = path.dirname(url.fileURLToPath(import.meta.url));
console.log(__metaDirname);

import "./dist/index.mjs";
