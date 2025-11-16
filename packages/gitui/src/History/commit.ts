import type { Commit } from "."
import { History } from "."

export function commit(): Commit | undefined {
    return History.list.selectedLine()?.data
}
