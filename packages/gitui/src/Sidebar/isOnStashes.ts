import { Sidebar } from "."

export function isOnStashes(): boolean {
    return Sidebar.list.selectedLine()?.type === "Stashes"
}
