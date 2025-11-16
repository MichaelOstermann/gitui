import type { Diff, DiffFile, DiffHunk } from "."

export function parse(diff: string): Diff {
    const lines = diff.split("\n")
    const files: DiffFile[] = []
    let file: DiffFile | undefined
    let hunk: DiffHunk | undefined

    for (const line of lines) {
        if (line.startsWith("diff ")) {
            file = {
                content: line,
                header: [line],
                hunks: [],
                type: "file",
            }
            files.push(file)
        }

        else if (line.startsWith("@@")) {
            if (!file) break
            hunk = {
                changes: [],
                content: line,
                file,
                type: "hunk",
            }
            file.hunks.push(hunk)
        }

        else if (line.startsWith("+++")) {
            file?.header.push(line)
        }

        else if (line.startsWith("---")) {
            file?.header.push(line)
        }

        else if (line.startsWith("+")) {
            hunk?.changes.push({ content: line, file: file!, hunk, type: "addition" })
        }

        else if (line.startsWith("-")) {
            hunk?.changes.push({ content: line, file: file!, hunk, type: "deletion" })
        }

        else if (line.startsWith(" ")) {
            hunk?.changes.push({ content: line, file: file!, hunk, type: "context" })
        }

        else {
            file?.header.push(line)
        }
    }

    return files
}
