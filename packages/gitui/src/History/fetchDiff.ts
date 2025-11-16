import type { Commit } from "."
import { $ } from "bun"
import { Diff } from "../Diff"

export async function fetchDiff(commit: Commit): Promise<Diff> {
    return Diff.parse(await $`git show ${commit.hash}`.text())
}
