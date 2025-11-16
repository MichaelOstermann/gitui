import { Stashes } from "."
import { Sidebar } from "../Sidebar"

export function render(): void {
    if (!Sidebar.isOnStashes()) return
    Stashes.list.render()
    Stashes.diff.render()
}
