import { writeFileSync, readFileSync } from 'node:fs'
const distCode = readFileSync('./dist/index.mjs', 'utf-8')
writeFileSync('./dist/index.mjs', '#!/usr/bin/env node\n' + distCode, 'utf-8')
