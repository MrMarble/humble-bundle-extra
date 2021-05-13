import { readFile } from "fs/promises"
import normalize from "normalize-package-data"
import { resolve } from "path"
import { cwd } from "process"

const defaultMeta = {
  name: "New Userscript",
  namespace: "http://tampermonkey.net/",
  version: "0.1",
  description: "try to take over the world!",
  match: "*",
  author: "You",
  grant: "none",
}

const getMeta = (meta) => {
  let result = "// ==UserScript==\n"
  let length = 0

  for (let key of Object.keys(meta)) {
    length = key.length > length ? key.length : length
  }
  length += 2
  for (const [key, value] of Object.entries(meta)) {
    if (Array.isArray(value)) {
      value.forEach(
        (val) => (result += `// @${key.padEnd(length, " ")}${val}\n`)
      )
    } else if (value !== "") {
      result += `// @${key.padEnd(length, " ")}${value}\n`
    }
  }
  result += "// ==/UserScript==\n"
  return result
}

async function readPackageAsync() {
  const filePath = resolve(cwd(), "package.json")
  const json = JSON.parse(await readFile(filePath, "utf8"))
  const { userscript } = json

  normalize(json)

  return {
    ...userscript,
    name: json.name,
    author: json.author.name,
    version: json.version,
    source: json.repository.url.replace(/git\+|\.git/gm, ""),
  }
}

export function generateMeta() {
  return {
    name: "generate-userscript-meta", // this name will show up in warnings and errors
    generateBundle: async function (_, bundle) {
      const pkg = await readPackageAsync()

      const meta = getMeta({
        ...defaultMeta,
        ...pkg,
        updateURL: `${pkg.source}/releases/latest/download/${pkg.name}.meta.js`,
        downloadURL: `${pkg.source}/releases/latest/download/${pkg.name}.script.js`,
      })

      for (const [, options] of Object.entries(bundle)) {
        options.code = meta + options.code
        options.fileName = `${pkg.name}.script.js`
      }
      this.emitFile({
        type: "asset",
        source: meta,
        fileName: `${pkg.name}.meta.js`,
      })
    },
  }
}
