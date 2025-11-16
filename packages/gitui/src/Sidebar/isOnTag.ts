import { Sidebar } from "."

export function isOnTag(): boolean {
    return Sidebar.list.selectedLine()?.type === "Tag"
}
