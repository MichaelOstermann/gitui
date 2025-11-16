import { Branches } from "."

export function isOnCommit(): boolean {
    return !!Branches.list.selectedLine()
}
