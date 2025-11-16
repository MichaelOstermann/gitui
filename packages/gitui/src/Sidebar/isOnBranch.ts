import { Sidebar } from "."

export function isOnBranch(): boolean {
    return Sidebar.isOnLocalBranch()
        || Sidebar.isOnRemoteBranch()
}
