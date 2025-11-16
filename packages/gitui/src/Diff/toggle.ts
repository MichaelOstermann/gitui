import type { DiffHunk, DiffLine } from "."
import type { Status } from "../WorkingCopy"
import { $ } from "bun"
import { temporaryFile } from "tempy"

export async function toggle(diff: DiffHunk | DiffLine, status: Status): Promise<void> {
    if (status.isConflict) return
    const path = temporaryFile()
    const stageHunk = diff.type === "hunk"
    const hunk = diff.type === "hunk"
        ? diff
        : diff.hunk

    if (!hunk) return

    const patchLines = [
        ...hunk.file.header,
        hunk.content,
        ...hunk.changes.map((l) => {
            if (l === diff || stageHunk) return l.content
            if (l.type === "addition" && !status.isStaged) return ""
            if (l.type === "deletion" && !status.isStaged) return ` ${l.content.slice(1)}`
            return l.content
        }),
    ].filter(l => !!l)

    const patch = `${patchLines.join("\n").trim()}\n`
    await Bun.write(path, patch)

    if (status.isStaged) await $`git apply --recount --cached --reverse ${path}`.quiet()
    else await $`git apply --recount --cached ${path}`.quiet()
}
