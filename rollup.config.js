import sizes from "rollup-plugin-sizes"
import { terser } from "rollup-plugin-terser"

import { generateMeta } from "./plugin/rollup-plugin-userscript-meta"

// rollup.config.js
export default {
  input: "src/script.js",
  output: {
    dir: "dist",
    format: "iife",
  },
  plugins: [terser(), sizes(), generateMeta()],
}
