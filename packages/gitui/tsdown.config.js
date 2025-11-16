import treeshake from "@monstermann/unplugin-tree-shake-import-namespaces/rolldown"
import { defineConfig } from "tsdown"

const identifiers = new Set([
    "Branches",
    "Commandline",
    "Diff",
    "Filter",
    "Git",
    "History",
    "Sidebar",
    "Stashes",
    "Statusbar",
    "Tags",
    "WorkingCopy",
])

export default defineConfig({
    clean: true,
    dts: true,
    entry: ["./src/index.ts"],
    external: ["bun"],
    format: "esm",
    outputOptions: {
        banner: "#!/usr/bin/env bun",
    },
    plugins: [
        treeshake({
            resolve({ importAlias, importName, importPath, propertyName }) {
                if (!identifiers.has(importName)) return
                return `import { ${propertyName} as ${importAlias} } from "${importPath}/${propertyName}"`
            },
        }),
    ],
})
