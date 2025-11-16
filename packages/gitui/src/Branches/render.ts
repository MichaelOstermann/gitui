import { Branches } from "."
import { Sidebar } from "../Sidebar"

export function render(): void {
    if (!Sidebar.isOnLocalBranch() && !Sidebar.isOnRemoteBranch()) return
    Branches.list.render()
    Branches.diff.render()
}
