import type { DiffFile } from "."

export function parseFile(file: DiffFile): { from?: string, to?: string } {
    const [_, fromFile, toFile] = file.content.match(/^diff --git a\/(.+?) b\/(.+$)/) ?? []
    return { from: fromFile, to: toFile }
}
