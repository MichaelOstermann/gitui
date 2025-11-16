import type { Stash } from "."
import { Stashes } from "."

export function stash(): Stash | undefined {
    const line = Stashes.list.selectedLine()
    if (line) return line.data
    return undefined
}
