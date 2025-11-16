import { Sidebar } from "."

export function isOnHistory(): boolean {
    return Sidebar.list.selectedLine()?.type === "History"
}
