import type { Commit } from "../History"
import { Branches } from "."

export function commit(): Commit | undefined {
    const line = Branches.list.selectedLine()
    return line?.data
}
