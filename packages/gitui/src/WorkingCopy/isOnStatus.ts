import { WorkingCopy } from "."

export function isOnStatus(): boolean {
    return WorkingCopy.list.selectedLine()?.type === "Status"
}
