import { $ } from "bun"
import { Diff } from "../Diff"

export async function fetchDiff(id: string): Promise<Diff> {
    return Diff.parse(await $`git stash show -p --include-untracked stash@{${id}}`.text())
}
