export type Diff = DiffFile[]

export type DiffFile = {
    content: string
    header: string[]
    hunks: DiffHunk[]
    type: "file"
}

export type DiffHunk = {
    changes: DiffLine[]
    content: string
    file: DiffFile
    type: "hunk"
}

export type DiffLine = {
    content: string
    file: DiffFile
    hunk: DiffHunk
    type: "addition" | "deletion" | "context"
}
