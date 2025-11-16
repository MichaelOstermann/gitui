import { Sidebar } from "."

export function isOnWorkingCopy(): boolean {
    return Sidebar.list.selectedLine()?.type === "WorkingCopy"
}
