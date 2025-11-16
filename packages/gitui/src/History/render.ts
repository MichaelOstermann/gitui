import { History } from "."
import { Sidebar } from "../Sidebar"

export function render(): void {
    if (!Sidebar.isOnHistory()) return
    History.list.render()
    History.diff.render()
}
