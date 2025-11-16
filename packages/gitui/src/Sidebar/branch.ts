import type { LocalBranch, RemoteBranch } from "../Branches"
import { Sidebar } from "."

export function branch(): LocalBranch | RemoteBranch | undefined {
    const line = Sidebar.list.selectedLine()
    if (line?.type === "LocalBranch") return line.branch
    if (line?.type === "RemoteBranch") return line.branch
    return undefined
}
