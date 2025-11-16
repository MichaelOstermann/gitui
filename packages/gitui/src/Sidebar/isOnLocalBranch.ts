import { Sidebar } from "."

export function isOnLocalBranch(): boolean {
    return Sidebar.list.selectedLine()?.type === "LocalBranch"
}
