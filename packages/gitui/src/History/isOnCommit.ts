import { History } from "."

export function isOnCommit(): boolean {
    return !!History.list.selectedLine()
}
