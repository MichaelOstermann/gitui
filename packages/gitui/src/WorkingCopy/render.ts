import { WorkingCopy } from "."
import { Sidebar } from "../Sidebar"

export function render(): void {
    if (!Sidebar.isOnWorkingCopy()) return
    WorkingCopy.list.render()
    WorkingCopy.diff.render()
}
