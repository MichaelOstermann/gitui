import { Sidebar } from "."

export function isOnRemoteBranch(): boolean {
    return Sidebar.list.selectedLine()?.type === "RemoteBranch"
}
